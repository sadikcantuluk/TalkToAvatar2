require 'httparty'
require 'json'
require 'open3'
require 'shellwords'
require 'uri'
require 'base64'

class AzureSpeechService
  # Azure Speech API endpoint for pronunciation assessment
  PRONUNCIATION_ASSESSMENT_ENDPOINT = '/speech/recognition/conversation/cognitiveservices/v1'.freeze

  def initialize
    @subscription_key = ENV['AZURE_SPEECH_KEY']
    @region = ENV['AZURE_SPEECH_REGION'] || 'germanywestcentral'
    endpoint_base = ENV['AZURE_SPEECH_ENDPOINT'] || "https://#{@region}.api.cognitive.microsoft.com"
    # Remove trailing slash if present
    @endpoint_base = endpoint_base.chomp('/')
    
    unless @subscription_key
      raise 'Azure Speech API key not found. Please set AZURE_SPEECH_KEY in your .env file'
    end
  end

  # Assess pronunciation from local file path
  # @param audio_path [String] Local file path to the audio file
  # @param reference_text [String] The reference text for pronunciation assessment
  # @param language_code [String] Language code (e.g., 'en', 'tr', 'de')
  # @return [Hash] Assessment results with overall_score, accuracy, fluency, words[]
  def assess_pronunciation_from_file(audio_path, reference_text, language_code = 'en')
    begin
      Rails.logger.info "=== Azure Speech Assessment (from file) ==="
      Rails.logger.info "Audio path: #{audio_path}"
      Rails.logger.info "Reference text: #{reference_text}"
      Rails.logger.info "Language: #{language_code}"

      # Store audio path for potential Whisper fallback
      @current_audio_path = audio_path

      # Convert .m4a to WAV 16kHz mono using ffmpeg
      Rails.logger.info "=== Step 1: Audio Conversion ==="
      wav_temp = Tempfile.new(['converted', '.wav'])
      wav_path = wav_temp.path
      
      conversion_success = convert_to_wav(audio_path, wav_path)
      
      # If FFmpeg conversion failed, try to send original file to Azure first
      # If that fails, fall back to OpenAI Whisper
      unless conversion_success
        Rails.logger.warn "=== FFmpeg conversion failed ==="
        Rails.logger.warn "FFmpeg is required for Azure Speech API. Attempting to use original file format..."
        wav_temp.close
        wav_temp.unlink
        
        # Try Azure with original file format first
        azure_result = try_azure_with_original_format(audio_path, reference_text, language_code)
        
        if azure_result && azure_result[:success]
          Rails.logger.info "Azure Speech API worked with original file format"
          return azure_result
        else
          Rails.logger.warn "Azure Speech API failed with original format. Error: #{azure_result[:error] if azure_result}"
          Rails.logger.warn "Falling back to OpenAI Whisper for transcription..."
          
          # Try OpenAI Whisper as last resort
          whisper_transcript = get_transcription_with_whisper_from_file(audio_path, language_code)
          
          if whisper_transcript && !whisper_transcript.strip.empty?
            Rails.logger.info "OpenAI Whisper transcription successful, using fallback assessment"
            return fallback_assessment(reference_text, whisper_transcript, "FFmpeg not available - used OpenAI Whisper for transcription", audio_path)
          else
            Rails.logger.error "Both Azure and OpenAI Whisper failed"
            return {
              success: false,
              error: "Azure Speech API requires FFmpeg for audio conversion. Please install FFmpeg. See backend/docs/FFMPEG_SETUP.md for instructions.",
              transcript: '',
              reference_text: reference_text,
              overall_score: 0,
              accuracy: 0,
              fluency: 0,
              completeness: 0,
              words: []
            }
          end
        end
      end

      # Normalize language code
      azure_language = normalize_language_code(language_code)
      Rails.logger.info "Using Azure language code: #{azure_language}"

      # Build Azure Speech API endpoint (without referenceText in URL - it goes in header)
      endpoint = "https://#{@region}.stt.speech.microsoft.com#{PRONUNCIATION_ASSESSMENT_ENDPOINT}?language=#{azure_language}&format=detailed"
      
      # Create Pronunciation-Assessment header with base64-encoded JSON
      # This is REQUIRED for pronunciation scoring in Azure Speech API REST API
      pronunciation_assessment_config = {
        ReferenceText: reference_text,
        GradingSystem: "HundredMark",
        Dimension: "Comprehensive",
        EnableMiscue: true,
        Granularity: "Word"
      }
      
      pronunciation_assessment_json = pronunciation_assessment_config.to_json
      pronunciation_assessment_base64 = Base64.strict_encode64(pronunciation_assessment_json)
      
      Rails.logger.info "=== Step 2: Calling Azure Speech API with Pronunciation Assessment ==="
      Rails.logger.info "Endpoint: #{endpoint}"
      Rails.logger.info "Reference text: #{reference_text}"
      Rails.logger.info "Pronunciation Assessment config: #{pronunciation_assessment_config.inspect}"
      Rails.logger.info "Pronunciation Assessment JSON: #{pronunciation_assessment_json}"
      Rails.logger.info "Pronunciation Assessment Base64: #{pronunciation_assessment_base64}"
      Rails.logger.info "WAV file size: #{File.size(wav_path)} bytes"
      Rails.logger.info "Azure region: #{@region}"
      Rails.logger.info "Language: #{azure_language}"

      # Read WAV file
      wav_data = File.binread(wav_path)
      Rails.logger.info "WAV data read: #{wav_data.bytesize} bytes"
      
      # Make request to Azure Speech API with Pronunciation-Assessment header
      Rails.logger.info "Sending request to Azure at: #{Time.now}"
      start_time = Time.now
      
      response = HTTParty.post(
        endpoint,
        body: wav_data,
        headers: {
          'Ocp-Apim-Subscription-Key' => @subscription_key,
          'Content-Type' => 'audio/wav; codec=audio/pcm; samplerate=16000',
          'Accept' => 'application/json',
          'Pronunciation-Assessment' => pronunciation_assessment_base64
        },
        timeout: 30
      )
      
      end_time = Time.now
      duration = ((end_time - start_time) * 1000).round(2)
      Rails.logger.info "=== Azure API Response ==="
      Rails.logger.info "Response time: #{duration}ms"
      Rails.logger.info "Response status: #{response.code}"
      Rails.logger.info "Response body length: #{response.body.length} chars"
      Rails.logger.info "Response body (first 1000 chars): #{response.body[0..1000]}"

      # Clean up temp file
      wav_temp.close
      wav_temp.unlink

      # Handle response
      handle_azure_response(response, reference_text)

    rescue HTTParty::Error => e
      Rails.logger.error "HTTP error: #{e.message}"
      handle_error_response(e.response, reference_text) if e.respond_to?(:response)
      fallback_assessment(reference_text, nil, "Network error: #{e.message}")
    rescue => e
      Rails.logger.error "Azure Speech Service error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      fallback_assessment(reference_text, nil, e.message)
    end
  end

  # Assess pronunciation using Azure Speech Assessment API
  # @param audio_url [String] URL of the audio file to assess (can be .m4a)
  # @param reference_text [String] The reference text for pronunciation assessment
  # @param language_code [String] Language code (e.g., 'en', 'tr', 'de')
  # @return [Hash] Assessment results with overall_score, accuracy, fluency, words[]
  def assess_pronunciation_simple(audio_url, reference_text, language_code = 'en')
    begin
      Rails.logger.info "=== Azure Speech Assessment ==="
      Rails.logger.info "Audio URL: #{audio_url}"
      Rails.logger.info "Reference text: #{reference_text}"
      Rails.logger.info "Language: #{language_code}"

      # Download audio file
      Rails.logger.info "Downloading audio file..."
      audio_data = HTTParty.get(audio_url, timeout: 30).body
      
      # Save original audio to temp file
      original_temp = Tempfile.new(['original', '.m4a'])
      original_temp.binmode
      original_temp.write(audio_data)
      original_temp.rewind
      original_path = original_temp.path

      # Convert .m4a to WAV 16kHz mono using ffmpeg
      Rails.logger.info "Converting audio to WAV 16kHz mono..."
      wav_temp = Tempfile.new(['converted', '.wav'])
      wav_path = wav_temp.path
      
      conversion_success = convert_to_wav(original_path, wav_path)
      
      unless conversion_success
        Rails.logger.error "FFmpeg conversion failed, using original file"
        # Fallback: try to use original file if conversion fails
        wav_path = original_path
      end

      # Normalize language code
      azure_language = normalize_language_code(language_code)
      Rails.logger.info "Using Azure language code: #{azure_language}"

      # Build Azure Speech API endpoint (without referenceText in URL - it goes in header)
      endpoint = "https://#{@region}.stt.speech.microsoft.com#{PRONUNCIATION_ASSESSMENT_ENDPOINT}?language=#{azure_language}&format=detailed"
      
      # Create Pronunciation-Assessment header with base64-encoded JSON
      # This is REQUIRED for pronunciation scoring in Azure Speech API REST API
      pronunciation_assessment_config = {
        ReferenceText: reference_text,
        GradingSystem: "HundredMark",
        Dimension: "Comprehensive",
        EnableMiscue: true,
        Granularity: "Word"
      }
      
      pronunciation_assessment_json = pronunciation_assessment_config.to_json
      pronunciation_assessment_base64 = Base64.strict_encode64(pronunciation_assessment_json)
      
      Rails.logger.info "=== Step 2: Calling Azure Speech API (URL-based) with Pronunciation Assessment ==="
      Rails.logger.info "Endpoint: #{endpoint}"
      Rails.logger.info "Reference text: #{reference_text}"
      Rails.logger.info "Pronunciation Assessment config: #{pronunciation_assessment_config.inspect}"
      Rails.logger.info "Pronunciation Assessment JSON: #{pronunciation_assessment_json}"
      Rails.logger.info "Pronunciation Assessment Base64: #{pronunciation_assessment_base64}"
      Rails.logger.info "WAV file size: #{File.size(wav_path)} bytes"
      Rails.logger.info "Azure region: #{@region}"
      Rails.logger.info "Language: #{azure_language}"

      # Read WAV file
      wav_data = File.binread(wav_path)
      Rails.logger.info "WAV data read: #{wav_data.bytesize} bytes"
      
      # Make request to Azure Speech API with Pronunciation-Assessment header
      Rails.logger.info "Sending request to Azure at: #{Time.now}"
      start_time = Time.now
      
      response = HTTParty.post(
        endpoint,
        body: wav_data,
        headers: {
          'Ocp-Apim-Subscription-Key' => @subscription_key,
          'Content-Type' => 'audio/wav; codec=audio/pcm; samplerate=16000',
          'Accept' => 'application/json',
          'Pronunciation-Assessment' => pronunciation_assessment_base64
        },
        timeout: 30
      )
      
      end_time = Time.now
      duration = ((end_time - start_time) * 1000).round(2)
      Rails.logger.info "=== Azure API Response (URL-based) ==="
      Rails.logger.info "Response time: #{duration}ms"
      Rails.logger.info "Response status: #{response.code}"
      Rails.logger.info "Response body length: #{response.body.length} chars"
      Rails.logger.info "Response body (first 1000 chars): #{response.body[0..1000]}"

      # Clean up temp files
      original_temp.close
      original_temp.unlink
      wav_temp.close
      wav_temp.unlink

      # Handle response
      handle_azure_response(response, reference_text)

    rescue HTTParty::Error => e
      Rails.logger.error "HTTP error: #{e.message}"
      handle_error_response(e.response, reference_text) if e.respond_to?(:response)
      fallback_assessment(reference_text, nil, "Network error: #{e.message}")
    rescue => e
      Rails.logger.error "Azure Speech Service error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      fallback_assessment(reference_text, nil, e.message)
    end
  end

  private

  # Convert audio file to WAV 16kHz mono using ffmpeg
  def convert_to_wav(input_path, output_path)
    begin
      Rails.logger.info "=== FFmpeg Conversion Debug ==="
      Rails.logger.info "Input file: #{input_path}"
      Rails.logger.info "Input file exists: #{File.exist?(input_path)}"
      Rails.logger.info "Input file size: #{File.exist?(input_path) ? File.size(input_path) : 'N/A'} bytes"
      Rails.logger.info "Output file: #{output_path}"
      Rails.logger.info "Platform: #{Gem.win_platform? ? 'Windows' : 'Unix/Linux/macOS'}"
      
      # Check if ffmpeg is available (Windows uses 'where', Unix uses 'which')
      check_cmd = Gem.win_platform? ? 'where' : 'which'
      Rails.logger.info "Checking FFmpeg with command: #{check_cmd} ffmpeg"
      
      check_output, check_status = Open3.capture2e(check_cmd, 'ffmpeg')
      Rails.logger.info "Check command output: #{check_output.strip}"
      Rails.logger.info "Check command status: #{check_status.success? ? 'SUCCESS' : 'FAILED'} (exit code: #{check_status.exitstatus})"
      
      unless check_status.success?
        # Try direct ffmpeg call as fallback
        Rails.logger.info "Trying direct ffmpeg call: ffmpeg -version"
        direct_output, direct_status = Open3.capture2e('ffmpeg', '-version')
        Rails.logger.info "Direct call output (first 200 chars): #{direct_output[0..200]}"
        Rails.logger.info "Direct call status: #{direct_status.success? ? 'SUCCESS' : 'FAILED'} (exit code: #{direct_status.exitstatus})"
        
        unless direct_status.success?
          Rails.logger.error "=== FFmpeg NOT FOUND ==="
          Rails.logger.error "Both '#{check_cmd} ffmpeg' and 'ffmpeg -version' failed"
          Rails.logger.error "Please install FFmpeg and ensure it's in your PATH"
          return false
        else
          Rails.logger.info "FFmpeg found via direct call"
        end
      else
        Rails.logger.info "FFmpeg found via #{check_cmd} command"
      end

      # Verify input file
      unless File.exist?(input_path)
        Rails.logger.error "Input file does not exist: #{input_path}"
        return false
      end
      
      input_size = File.size(input_path)
      Rails.logger.info "Input file size: #{input_size} bytes"
      
      if input_size == 0
        Rails.logger.error "Input file is empty!"
        return false
      end

      # Convert to WAV 16kHz mono
      # -i: input file
      # -ar 16000: sample rate 16kHz
      # -ac 1: mono channel
      # -f wav: output format WAV
      # -y: overwrite output file
      cmd = "ffmpeg -i #{Shellwords.escape(input_path)} -ar 16000 -ac 1 -f wav #{Shellwords.escape(output_path)} -y 2>&1"
      
      Rails.logger.info "=== Running FFmpeg Conversion ==="
      Rails.logger.info "Command: #{cmd}"
      Rails.logger.info "Starting conversion at: #{Time.now}"
      
      start_time = Time.now
      output, status = Open3.capture2e(cmd)
      end_time = Time.now
      duration = ((end_time - start_time) * 1000).round(2)
      
      Rails.logger.info "Conversion completed in #{duration}ms"
      Rails.logger.info "Exit code: #{status.exitstatus}"
      Rails.logger.info "FFmpeg output (first 500 chars): #{output[0..500]}"
      
      if status.success?
        if File.exist?(output_path)
          output_size = File.size(output_path)
          Rails.logger.info "Output file created successfully"
          Rails.logger.info "Output file size: #{output_size} bytes"
          Rails.logger.info "Size ratio: #{(output_size.to_f / input_size * 100).round(2)}%"
          
          if output_size > 0
            Rails.logger.info "=== FFmpeg Conversion SUCCESS ==="
            return true
          else
            Rails.logger.error "Output file is empty!"
            Rails.logger.error "Full FFmpeg output: #{output}"
            return false
          end
        else
          Rails.logger.error "Output file was not created!"
          Rails.logger.error "Full FFmpeg output: #{output}"
          return false
        end
      else
        Rails.logger.error "=== FFmpeg Conversion FAILED ==="
        Rails.logger.error "Exit code: #{status.exitstatus}"
        Rails.logger.error "Full FFmpeg output: #{output}"
        return false
      end
    rescue => e
      Rails.logger.error "=== FFmpeg Conversion EXCEPTION ==="
      Rails.logger.error "Error: #{e.class.name}"
      Rails.logger.error "Message: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join("\n")}"
      return false
    end
  end

  # Handle Azure API response
  def handle_azure_response(response, reference_text)
    case response.code
    when 200
      parse_successful_response(response, reference_text)
    when 400
      Rails.logger.error "Bad Request (400): #{response.body}"
      fallback_assessment(reference_text, nil, "Invalid request format")
    when 401
      Rails.logger.error "Unauthorized (401): Invalid API key"
      fallback_assessment(reference_text, nil, "Authentication failed. Please check your Azure Speech API key")
    when 415
      Rails.logger.error "Unsupported Media Type (415): #{response.body}"
      fallback_assessment(reference_text, nil, "Unsupported audio format. Please ensure audio is in WAV format")
    when 429
      Rails.logger.error "Too Many Requests (429): Rate limit exceeded"
      fallback_assessment(reference_text, nil, "Rate limit exceeded. Please try again later")
    when 500
      Rails.logger.error "Internal Server Error (500): #{response.body}"
      fallback_assessment(reference_text, nil, "Azure service error. Please try again later")
    else
      Rails.logger.error "Unexpected status code #{response.code}: #{response.body}"
      fallback_assessment(reference_text, nil, "Unexpected error: #{response.code}")
    end
  end

  # Handle error response
  def handle_error_response(response, reference_text)
    return unless response
    
    case response.code
    when 400
      fallback_assessment(reference_text, nil, "Invalid request")
    when 401
      fallback_assessment(reference_text, nil, "Authentication failed")
    when 415
      fallback_assessment(reference_text, nil, "Unsupported audio format")
    when 429
      fallback_assessment(reference_text, nil, "Rate limit exceeded")
    when 500
      fallback_assessment(reference_text, nil, "Server error")
    else
      fallback_assessment(reference_text, nil, "Error: #{response.code}")
    end
  end

  # Parse successful Azure response
  def parse_successful_response(response, reference_text)
    begin
      Rails.logger.info "=== Step 3: Parsing Azure Response ==="
      
      data = response.parsed_response || JSON.parse(response.body)
      
      Rails.logger.info "Parsed response keys: #{data.keys.inspect}"
      Rails.logger.info "RecognitionStatus: #{data['RecognitionStatus']}"
      Rails.logger.info "NBest array length: #{(data['NBest'] || []).length}"

      # Azure returns recognition result
      if data['RecognitionStatus'] == 'Success'
        # Get the best result
        n_best = data['NBest'] || []
        Rails.logger.info "NBest array: #{n_best.inspect}"
        
        best_result = n_best.first || data
        Rails.logger.info "Best result keys: #{best_result.keys.inspect}"
        
        # Extract pronunciation assessment data
        # Azure returns pronunciation scores directly in the NBest result, not in a separate PronunciationAssessment object
        pronunciation_assessment = best_result.slice('AccuracyScore', 'FluencyScore', 'CompletenessScore', 'PronScore')
        Rails.logger.info "=== Pronunciation Assessment Data ==="
        Rails.logger.info "Pronunciation scores: #{pronunciation_assessment.inspect}"
        
        # Azure Pronunciation Assessment response structure:
        # - PronScore: Overall pronunciation score (0-100)
        # - AccuracyScore: Accuracy score (0-100)
        # - FluencyScore: Fluency score (0-100)
        # - CompletenessScore: Completeness score (0-100)
        # - ProsodyScore: Prosody score (0-100) - optional (if present in response)
        
        overall_score = pronunciation_assessment['PronScore']
        accuracy = pronunciation_assessment['AccuracyScore']
        fluency = pronunciation_assessment['FluencyScore']
        completeness = pronunciation_assessment['CompletenessScore']
        prosody = best_result['ProsodyScore']
        
        Rails.logger.info "=== Extracted Scores from Azure ==="
        Rails.logger.info "PronScore (Overall): #{overall_score.inspect}"
        Rails.logger.info "AccuracyScore: #{accuracy.inspect}"
        Rails.logger.info "FluencyScore: #{fluency.inspect}"
        Rails.logger.info "CompletenessScore: #{completeness.inspect}"
        Rails.logger.info "ProsodyScore: #{prosody.inspect}" if prosody
        
        # If pronunciation scores are missing, Azure didn't return pronunciation assessment
        if overall_score.nil? && accuracy.nil? && fluency.nil? && completeness.nil?
          Rails.logger.error "=== ERROR: Azure did not return Pronunciation Assessment scores ==="
          Rails.logger.error "This means the Pronunciation-Assessment header may not be working correctly"
          Rails.logger.error "Response structure: #{best_result.keys.inspect}"
          Rails.logger.error "Full best_result: #{best_result.inspect}"
          return {
            success: false,
            error: "Azure Speech API did not return pronunciation assessment scores. Please check the Pronunciation-Assessment header configuration.",
            transcript: best_result['DisplayText'] || best_result['Text'] || data['DisplayText'] || '',
            reference_text: reference_text,
            overall_score: 0,
            accuracy: 0,
            fluency: 0,
            completeness: 0,
            words: []
          }
        end
        
        # Extract words with pronunciation details
        words = extract_words(best_result['Words'] || [])
        Rails.logger.info "Extracted #{words.length} words with pronunciation details"
        words.each_with_index do |word, idx|
          Rails.logger.info "Word #{idx + 1}: #{word['word']} - Accuracy: #{word['accuracy_score']}, ErrorType: #{word['error_type']}"
        end
        
        transcript = best_result['DisplayText'] || best_result['Text'] || data['DisplayText'] || ''
        Rails.logger.info "Extracted transcript: '#{transcript}'"
        Rails.logger.info "Transcript length: #{transcript.length} chars"
        
        # Validate that we have at least overall score
        unless overall_score
          Rails.logger.error "=== ERROR: Azure returned Pronunciation Assessment but PronScore is missing ==="
          return {
            success: false,
            error: "Azure Speech API returned pronunciation assessment data but PronScore is missing.",
            transcript: transcript,
            reference_text: reference_text,
            overall_score: 0,
            accuracy: 0,
            fluency: 0,
            completeness: 0,
            words: words
          }
        end
        
        {
          success: true,
          overall_score: overall_score.to_i,
          accuracy: (accuracy || overall_score).to_i,
          fluency: (fluency || overall_score).to_i,
          completeness: (completeness || overall_score).to_i,
          transcript: transcript,
          words: words,
          reference_text: reference_text
        }
      else
        Rails.logger.error "=== Azure Recognition Failed ==="
        Rails.logger.error "RecognitionStatus: #{data['RecognitionStatus']}"
        Rails.logger.error "Full response: #{data.inspect}"
        return {
          success: false,
          error: "Azure Speech API recognition failed: #{data['RecognitionStatus']}",
          transcript: data['DisplayText'] || '',
          reference_text: reference_text,
          overall_score: 0,
          accuracy: 0,
          fluency: 0,
          completeness: 0,
          words: []
        }
      end
    rescue JSON::ParserError => e
      Rails.logger.error "=== Failed to Parse Azure Response ==="
      Rails.logger.error "Error: #{e.message}"
      Rails.logger.error "Response body: #{response.body}"
      return {
        success: false,
        error: "Failed to parse Azure Speech API response: #{e.message}",
        transcript: '',
        reference_text: reference_text,
        overall_score: 0,
        accuracy: 0,
        fluency: 0,
        completeness: 0,
        words: []
      }
    rescue => e
      Rails.logger.error "=== Error Parsing Azure Response ==="
      Rails.logger.error "Error class: #{e.class.name}"
      Rails.logger.error "Error message: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join("\n")}"
      return {
        success: false,
        error: "Error processing Azure Speech API response: #{e.message}",
        transcript: '',
        reference_text: reference_text,
        overall_score: 0,
        accuracy: 0,
        fluency: 0,
        completeness: 0,
        words: []
      }
    end
  end

  # Extract word-level details from Azure response
  def extract_words(words_array)
    return [] if words_array.nil? || words_array.empty?
    
    Rails.logger.info "=== Extracting Word-Level Details ==="
    Rails.logger.info "Words array length: #{words_array.length}"
    
    words_array.map.with_index do |word_data, idx|
      Rails.logger.info "Word #{idx + 1} data keys: #{word_data.keys.inspect}"
      Rails.logger.info "Word #{idx + 1} full data: #{word_data.inspect}"
      
      # Each word in Azure response has AccuracyScore and ErrorType directly in the word object
      # Use string keys to ensure proper JSON serialization
      {
        'word' => word_data['Word'] || '',
        'accuracy_score' => word_data['AccuracyScore'] || 0,
        'error_type' => word_data['ErrorType'] || nil,
        'offset' => word_data['Offset'] || 0,
        'duration' => word_data['Duration'] || 0
      }
    end
  end

  # Fallback assessment when Azure API fails - uses OpenAI Whisper for real transcription
  def fallback_assessment(reference_text, transcript, error_message = nil, audio_path = nil)
    transcript ||= ''
    
    # If transcript is empty, try to get real transcription using OpenAI Whisper
    if transcript.strip.empty?
      Rails.logger.info "=== Transcript is empty - attempting OpenAI Whisper transcription ==="
      
      # Use provided audio_path or stored @current_audio_path
      audio_file_path = audio_path || @current_audio_path
      
      if audio_file_path && File.exist?(audio_file_path)
        Rails.logger.info "Attempting OpenAI Whisper transcription from audio path: #{audio_file_path}"
        whisper_transcript = get_transcription_with_whisper_from_file(audio_file_path, nil)
        
        if whisper_transcript && !whisper_transcript.strip.empty?
          Rails.logger.info "OpenAI Whisper transcription successful: #{whisper_transcript}"
          transcript = whisper_transcript
        else
          Rails.logger.error "OpenAI Whisper transcription failed or returned empty"
          # Return error instead of fake scores
          return {
            success: false,
            error: "Unable to process audio. Please ensure FFmpeg is installed for Azure Speech API, or check OpenAI API configuration.",
            transcript: '',
            reference_text: reference_text,
            overall_score: 0,
            accuracy: 0,
            fluency: 0,
            completeness: 0,
            words: []
          }
        end
      else
        Rails.logger.error "Audio file path not available for Whisper transcription"
        Rails.logger.error "Provided audio_path: #{audio_path.inspect}"
        Rails.logger.error "Stored @current_audio_path: #{@current_audio_path.inspect}"
        return {
          success: false,
          error: "Unable to process audio. Please ensure FFmpeg is installed for Azure Speech API, or check OpenAI API configuration.",
          transcript: '',
          reference_text: reference_text,
          overall_score: 0,
          accuracy: 0,
          fluency: 0,
          completeness: 0,
          words: []
        }
      end
    end
    
    # Calculate real scores with available transcript
    Rails.logger.info "Calculating scores with transcript: #{transcript}"
    accuracy = calculate_accuracy_score(reference_text, transcript)
    fluency = estimate_fluency(transcript, reference_text)
    completeness = calculate_completeness(reference_text, transcript)
    overall_score = (accuracy * 0.5 + fluency * 0.3 + completeness * 0.2).round
    
    Rails.logger.info "Calculated scores - Overall: #{overall_score}, Accuracy: #{accuracy}, Fluency: #{fluency}, Completeness: #{completeness}"
    
    # Generate word-level details
    words = generate_word_level_details(reference_text, transcript)
    
    {
      success: true,
      overall_score: overall_score,
      accuracy: accuracy,
      fluency: fluency,
      completeness: completeness,
      transcript: transcript,
      words: words,
      reference_text: reference_text,
      note: error_message ? "Fallback scoring used: #{error_message}" : "Fallback scoring used"
    }
  end
  
  # Get transcription using OpenAI Whisper from file
  def get_transcription_with_whisper_from_file(audio_path, language_code = 'en')
    begin
      Rails.logger.info "=== OpenAI Whisper Transcription ==="
      Rails.logger.info "Audio file: #{audio_path}"
      Rails.logger.info "Language: #{language_code}"
      
      openai_key = ENV['OPENAI_API_KEY']
      unless openai_key
        Rails.logger.error "OpenAI API key not found in ENV['OPENAI_API_KEY']"
        return nil
      end
      
      Rails.logger.info "OpenAI API key found (length: #{openai_key.length})"
      
      # Check if file exists
      unless File.exist?(audio_path)
        Rails.logger.error "Audio file does not exist: #{audio_path}"
        return nil
      end
      
      file_size = File.size(audio_path)
      Rails.logger.info "Audio file size: #{file_size} bytes"
      
      if file_size == 0
        Rails.logger.error "Audio file is empty"
        return nil
      end
      
      # Use OpenAI Whisper API
      # ruby-openai gem uses 'ruby/openai' require
      require 'ruby/openai' unless defined?(OpenAI)
      client = OpenAI::Client.new(access_token: openai_key)
      
      Rails.logger.info "Calling OpenAI Whisper API..."
      start_time = Time.now
      
      # Read audio file
      audio_file = File.open(audio_path, 'rb')
      
      response = client.audio.transcribe(
        parameters: {
          model: 'whisper-1',
          file: audio_file,
          language: language_code
        }
      )
      
      audio_file.close
      
      end_time = Time.now
      duration = ((end_time - start_time) * 1000).round(2)
      
      Rails.logger.info "OpenAI Whisper API call completed in #{duration}ms"
      
      if response && response['text']
        transcript = response['text'].strip
        Rails.logger.info "Transcription successful: #{transcript}"
        return transcript
      else
        Rails.logger.error "OpenAI Whisper returned empty or invalid response: #{response.inspect}"
        return nil
      end
      
    rescue OpenAI::Error => e
      Rails.logger.error "OpenAI API error: #{e.class.name} - #{e.message}"
      Rails.logger.error "Error details: #{e.response.inspect}" if e.respond_to?(:response)
      return nil
    rescue => e
      Rails.logger.error "OpenAI Whisper transcription error: #{e.class.name}"
      Rails.logger.error "Error message: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join("\n")}"
      return nil
    end
  end

  def calculate_accuracy_score(reference, transcript)
    ref_words = reference.downcase.split(/\s+/)
    trans_words = transcript.downcase.split(/\s+/)
    
    matching = 0
    ref_words.each do |ref_word|
      if trans_words.any? { |t| t == ref_word || levenshtein_distance(ref_word, t) <= 1 }
        matching += 1
      end
    end
    
    return 100 if ref_words.empty?
    ((matching.to_f / ref_words.length) * 100).round
  end

  def estimate_fluency(transcript, reference)
    ref_length = reference.split(/\s+/).length
    trans_length = transcript.split(/\s+/).length
    
    length_ratio = ref_length > 0 ? [trans_length.to_f / ref_length, 1.0].min : 0
    (length_ratio * 100).round
  end

  def calculate_completeness(reference, transcript)
    ref_words = reference.downcase.split(/\s+/)
    trans_words = transcript.downcase.split(/\s+/)
    
    found_words = 0
    ref_words.each do |ref_word|
      if trans_words.any? { |t| t.include?(ref_word) || ref_word.include?(t) }
        found_words += 1
      end
    end
    
    return 100 if ref_words.empty?
    ((found_words.to_f / ref_words.length) * 100).round
  end

  def generate_word_level_details(reference, transcript)
    ref_words = reference.split(/\s+/)
    trans_words = transcript.downcase.split(/\s+/)
    
    ref_words.map.with_index do |ref_word, index|
      matched = trans_words.any? { |t| t == ref_word.downcase || levenshtein_distance(ref_word.downcase, t) <= 1 }
      {
        word: ref_word,
        accuracy_score: matched ? 100 : 0,
        error_type: matched ? nil : 'Pronunciation',
        offset: index * 100, # Approximate offset
        duration: 500 # Approximate duration
      }
    end
  end


  # Try Azure Speech API with original file format (when FFmpeg is not available)
  def try_azure_with_original_format(audio_path, reference_text, language_code)
    begin
      Rails.logger.info "=== Attempting Azure Speech API with original file format ==="
      Rails.logger.info "Audio path: #{audio_path}"
      Rails.logger.info "File extension: #{File.extname(audio_path)}"
      
      # Normalize language code
      azure_language = normalize_language_code(language_code)
      Rails.logger.info "Using Azure language code: #{azure_language}"
      
      # Build Azure Speech API endpoint (without referenceText in URL - it goes in header)
      endpoint = "https://#{@region}.stt.speech.microsoft.com#{PRONUNCIATION_ASSESSMENT_ENDPOINT}?language=#{azure_language}&format=detailed"
      
      # Create Pronunciation-Assessment header with base64-encoded JSON
      # This is REQUIRED for pronunciation scoring in Azure Speech API REST API
      pronunciation_assessment_config = {
        ReferenceText: reference_text,
        GradingSystem: "HundredMark",
        Dimension: "Comprehensive",
        EnableMiscue: true,
        Granularity: "Word"
      }
      
      pronunciation_assessment_json = pronunciation_assessment_config.to_json
      pronunciation_assessment_base64 = Base64.strict_encode64(pronunciation_assessment_json)
      
      Rails.logger.info "Endpoint: #{endpoint}"
      Rails.logger.info "Reference text: #{reference_text}"
      Rails.logger.info "Pronunciation Assessment config: #{pronunciation_assessment_config.inspect}"
      Rails.logger.info "Pronunciation Assessment JSON: #{pronunciation_assessment_json}"
      Rails.logger.info "Pronunciation Assessment Base64: #{pronunciation_assessment_base64}"
      
      # Read original file
      audio_data = File.binread(audio_path)
      file_ext = File.extname(audio_path).downcase
      
      # Determine content type based on file extension
      content_type = case file_ext
      when '.m4a'
        'audio/mp4'
      when '.mp3'
        'audio/mpeg'
      when '.wav'
        'audio/wav; codec=audio/pcm; samplerate=16000'
      else
        'audio/mp4' # Default to mp4 for .m4a
      end
      
      Rails.logger.info "Content-Type: #{content_type}"
      Rails.logger.info "Audio data size: #{audio_data.bytesize} bytes"
      
      # Make request to Azure Speech API with Pronunciation-Assessment header
      Rails.logger.info "Sending request to Azure at: #{Time.now}"
      start_time = Time.now
      
      response = HTTParty.post(
        endpoint,
        body: audio_data,
        headers: {
          'Ocp-Apim-Subscription-Key' => @subscription_key,
          'Content-Type' => content_type,
          'Accept' => 'application/json',
          'Pronunciation-Assessment' => pronunciation_assessment_base64
        },
        timeout: 30
      )
      
      end_time = Time.now
      duration = ((end_time - start_time) * 1000).round(2)
      Rails.logger.info "=== Azure API Response (original format) ==="
      Rails.logger.info "Response time: #{duration}ms"
      Rails.logger.info "Response status: #{response.code}"
      Rails.logger.info "Response body length: #{response.body.length} chars"
      Rails.logger.info "Response body (first 1000 chars): #{response.body[0..1000]}"
      
      # Handle response
      if response.code == 200
        return parse_successful_response(response, reference_text)
      else
        # Extract error message from response
        error_message = case response.code
        when 400
          "Invalid request format. Azure Speech API may require WAV format. Please install FFmpeg."
        when 401
          "Authentication failed. Please check your Azure Speech API key."
        when 415
          "Unsupported audio format. Azure Speech API requires WAV format. Please install FFmpeg for conversion."
        when 429
          "Rate limit exceeded. Please try again later."
        when 500
          "Azure service error. Please try again later."
        else
          "Azure API returned status #{response.code}. Response: #{response.body[0..200]}"
        end
        
        Rails.logger.error "Azure API error (#{response.code}): #{error_message}"
        return {
          success: false,
          error: error_message
        }
      end
    rescue => e
      Rails.logger.error "Error calling Azure with original format: #{e.class.name}"
      Rails.logger.error "Error message: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join("\n")}"
      return {
        success: false,
        error: "Failed to call Azure Speech API: #{e.message}"
      }
    end
  end

  def normalize_language_code(language_code)
    language_map = {
      'en' => 'en-US',
      'tr' => 'tr-TR',
      'de' => 'de-DE',
      'fr' => 'fr-FR',
      'es' => 'es-ES',
      'it' => 'it-IT',
      'pt' => 'pt-PT',
      'ar' => 'ar-SA'
    }
    
    language_map[language_code] || language_code
  end

  def levenshtein_distance(s1, s2)
    matrix = Array.new(s2.length + 1) { Array.new(s1.length + 1) }
    
    (0..s1.length).each { |i| matrix[0][i] = i }
    (0..s2.length).each { |j| matrix[j][0] = j }
    
    (1..s2.length).each do |j|
      (1..s1.length).each do |i|
        cost = s1[i - 1] == s2[j - 1] ? 0 : 1
        matrix[j][i] = [
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        ].min
      end
    end
    
    matrix[s2.length][s1.length]
  end
end
