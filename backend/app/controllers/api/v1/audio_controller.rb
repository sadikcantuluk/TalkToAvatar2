require 'httparty'

module Api
  module V1
    class AudioController < ApplicationController
      # Skip authentication for upload and evaluate endpoints
      skip_before_action :authenticate_request, only: [:upload, :evaluate]
      
      # POST /api/v1/upload_audio
      def upload
        audio_file = params[:audio]
        
        unless audio_file
          return render json: { error: 'No audio file provided' }, status: :bad_request
        end

        begin
          Rails.logger.info "Audio upload started. File: #{audio_file.original_filename rescue 'unknown'}"
          
          # Supabase configuration
          # Support both SUPABASE_SERVICE_KEY and SUPABASE_API_KEY for backward compatibility
          supabase_url = ENV['SUPABASE_URL']
          supabase_service_key = ENV['SUPABASE_SERVICE_KEY'] || ENV['SUPABASE_API_KEY']
          
          unless supabase_url && supabase_service_key
            missing_vars = []
            missing_vars << 'SUPABASE_URL' unless supabase_url
            unless supabase_service_key
              missing_vars << 'SUPABASE_SERVICE_KEY (or SUPABASE_API_KEY)'
            end
            
            error_msg = "Supabase configuration missing. Please add to .env file: #{missing_vars.join(', ')}"
            Rails.logger.error error_msg
            Rails.logger.error "Current ENV keys: SUPABASE_URL=#{supabase_url ? 'SET' : 'MISSING'}, SUPABASE_SERVICE_KEY=#{ENV['SUPABASE_SERVICE_KEY'] ? 'SET' : 'MISSING'}, SUPABASE_API_KEY=#{ENV['SUPABASE_API_KEY'] ? 'SET' : 'MISSING'}"
            return render json: { 
              error: error_msg,
              missing_variables: missing_vars,
              help: 'Add these to your backend/.env file: SUPABASE_URL=https://your-project.supabase.co and SUPABASE_SERVICE_KEY=your_service_role_key (or use SUPABASE_API_KEY if you have service_role key there)'
            }, status: :internal_server_error
          end
          
          Rails.logger.info "Using Supabase URL: #{supabase_url}"
          Rails.logger.info "Using Supabase key: #{ENV['SUPABASE_SERVICE_KEY'] ? 'SUPABASE_SERVICE_KEY' : 'SUPABASE_API_KEY'}"

          # Remove trailing slash from URL
          supabase_url = supabase_url.chomp('/')

          # Generate unique filename
          original_filename = audio_file.original_filename rescue 'recording.m4a'
          file_extension = File.extname(original_filename) || '.m4a'
          filename = "#{SecureRandom.uuid}_#{Time.now.to_i}#{file_extension}"
          bucket_name = 'sualingo-recordings'

          # Read file content
          audio_file.rewind if audio_file.respond_to?(:rewind)
          file_content = audio_file.read
          
          Rails.logger.info "File size: #{file_content.bytesize} bytes"
          
          # Upload to Supabase Storage using REST API
          # Endpoint: POST /storage/v1/object/{bucket}/{path}
          upload_url = "#{supabase_url}/storage/v1/object/#{bucket_name}/#{filename}"
          
          Rails.logger.info "Uploading to: #{upload_url}"
          
          upload_response = HTTParty.post(
            upload_url,
            body: file_content,
            headers: {
              'Authorization' => "Bearer #{supabase_service_key}",
              'Content-Type' => audio_file.content_type || 'audio/m4a',
              'x-upsert' => 'true' # Overwrite if exists
            },
            timeout: 30
          )

          Rails.logger.info "Upload response code: #{upload_response.code}"
          Rails.logger.info "Upload response: #{upload_response.body}"

          if upload_response.success?
            # Get public URL
            # Format: {supabase_url}/storage/v1/object/public/{bucket}/{path}
            public_url = "#{supabase_url}/storage/v1/object/public/#{bucket_name}/#{filename}"
            
            Rails.logger.info "Public URL: #{public_url}"

            render json: { url: public_url }, status: :ok
          else
            Rails.logger.error "Supabase upload failed: #{upload_response.code} - #{upload_response.body}"
            render json: { error: "Upload failed: #{upload_response.body}" }, status: :internal_server_error
          end
        rescue => e
          Rails.logger.error "Audio upload error: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: "Failed to upload audio: #{e.message}" }, status: :internal_server_error
        end
      end

      # POST /api/v1/evaluate
      # Accepts either audio_file (multipart) or audio_url (JSON)
      def evaluate
        audio_file = params[:audio_file] || params[:audio]
        audio_url = params[:audio_url]
        reference_text = params[:reference_text]
        language_code = params[:language_code] || 'en'

        unless reference_text
          return render json: { error: 'Missing required parameter: reference_text' }, status: :bad_request
        end

        unless audio_file || audio_url
          return render json: { error: 'Missing required parameter: audio_file or audio_url' }, status: :bad_request
        end

        begin
          # If audio file is provided, save it temporarily and use its path
          # Otherwise, use the provided audio_url
          if audio_file
            Rails.logger.info "Processing uploaded audio file: #{audio_file.original_filename rescue 'unknown'}"
            
            # Save uploaded file temporarily
            temp_file = Tempfile.new(['audio', '.m4a'])
            temp_file.binmode
            audio_file.rewind if audio_file.respond_to?(:rewind)
            temp_file.write(audio_file.read)
            temp_file.rewind
            
            # Create a local file URL for Azure service
            # Azure service will read from this local path
            audio_path = temp_file.path
            
            Rails.logger.info "Temporary file saved: #{audio_path}"
            
            # Use Azure Speech API for pronunciation assessment
            azure_service = AzureSpeechService.new
            assessment_result = azure_service.assess_pronunciation_from_file(
              audio_path,
              reference_text,
              language_code
            )
            
            # Clean up temp file
            temp_file.close
            temp_file.unlink
          else
            # Use existing URL-based method
            Rails.logger.info "Processing audio from URL: #{audio_url}"
            azure_service = AzureSpeechService.new
            assessment_result = azure_service.assess_pronunciation_simple(
              audio_url,
              reference_text,
              language_code
            )
          end

          if assessment_result[:success]
            # Return response in required format: overall_score, accuracy, fluency, words[]
            render json: {
              overall_score: assessment_result[:overall_score],
              accuracy: assessment_result[:accuracy],
              fluency: assessment_result[:fluency],
              completeness: assessment_result[:completeness],
              words: assessment_result[:words] || [],
              transcript: assessment_result[:transcript],
              reference_text: assessment_result[:reference_text],
              # Additional fields for backward compatibility
              score: assessment_result[:overall_score],
              accuracy_score: assessment_result[:accuracy],
              fluency_score: assessment_result[:fluency],
              completeness_score: assessment_result[:completeness],
              word_level_details: assessment_result[:words] || [],
              feedback: generate_feedback(assessment_result[:overall_score]),
              detailed_scores: {
                overall: assessment_result[:overall_score],
                accuracy: assessment_result[:accuracy],
                fluency: assessment_result[:fluency],
                completeness: assessment_result[:completeness]
              }
            }, status: :ok
          else
            Rails.logger.error "Azure Speech assessment failed: #{assessment_result[:error]}"
            render json: { error: assessment_result[:error] || 'Failed to evaluate pronunciation' }, status: :internal_server_error
          end
        rescue => e
          Rails.logger.error "Evaluation error: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'Failed to evaluate pronunciation' }, status: :internal_server_error
        end
      end

      private

      def calculate_pronunciation_score(reference, user_text)
        # Simple scoring algorithm based on Levenshtein distance
        ref = reference.downcase.strip
        usr = user_text.downcase.strip

        return 100 if ref == usr

        # Word-based comparison
        ref_words = ref.split(/\s+/)
        usr_words = usr.split(/\s+/)

        matching_words = 0
        ref_words.each do |ref_word|
          if usr_words.any? { |usr_word| usr_word == ref_word || levenshtein_distance(ref_word, usr_word) <= 1 }
            matching_words += 1
          end
        end

        word_score = (matching_words.to_f / ref_words.length) * 100

        # Character-based similarity
        char_score = (1 - (levenshtein_distance(ref, usr).to_f / [ref.length, usr.length].max)) * 100

        # Weighted average
        ((word_score * 0.7) + (char_score * 0.3)).round
      end

      def levenshtein_distance(s1, s2)
        matrix = Array.new(s2.length + 1) { Array.new(s1.length + 1) }

        (0..s1.length).each { |i| matrix[0][i] = i }
        (0..s2.length).each { |j| matrix[j][0] = j }

        (1..s2.length).each do |j|
          (1..s1.length).each do |i|
            cost = s1[i - 1] == s2[j - 1] ? 0 : 1
            matrix[j][i] = [
              matrix[j - 1][i] + 1,      # deletion
              matrix[j][i - 1] + 1,      # insertion
              matrix[j - 1][i - 1] + cost # substitution
            ].min
          end
        end

        matrix[s2.length][s1.length]
      end

      def generate_feedback(score)
        case score
        when 95..100
          'Excellent! Your pronunciation is nearly perfect.'
        when 85..94
          'Great job! Your pronunciation is very clear with minor improvements needed.'
        when 70..84
          'Good effort! Your pronunciation is understandable, but practice some words.'
        when 50..69
          'Keep practicing! Focus on pronunciation of key words.'
        else
          'More practice needed. Try listening to the reference audio again.'
        end
      end
    end
  end
end

