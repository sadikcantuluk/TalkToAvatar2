require 'supabase'

module Api
  module V1
    class AudioController < ApplicationController
      # POST /api/v1/upload_audio
      def upload
        audio_file = params[:audio]
        
        unless audio_file
          return render json: { error: 'No audio file provided' }, status: :bad_request
        end

        begin
          # Upload to Supabase storage
          supabase = Supabase::Client.new(
            ENV['SUPABASE_URL'],
            ENV['SUPABASE_SERVICE_KEY']
          )

          # Generate unique filename
          filename = "#{SecureRandom.uuid}_#{Time.now.to_i}.m4a"
          bucket_name = 'sualingo-recordings'

          # Upload file
          file_content = audio_file.read
          response = supabase.storage
            .from(bucket_name)
            .upload(filename, file_content, content_type: 'audio/m4a')

          # Get public URL
          public_url = supabase.storage
            .from(bucket_name)
            .get_public_url(filename)

          render json: { url: public_url }, status: :ok
        rescue => e
          Rails.logger.error "Audio upload error: #{e.message}"
          render json: { error: 'Failed to upload audio' }, status: :internal_server_error
        end
      end

      # POST /api/v1/evaluate
      def evaluate
        audio_url = params[:audio_url]
        reference_text = params[:reference_text]

        unless audio_url && reference_text
          return render json: { error: 'Missing required parameters' }, status: :bad_request
        end

        begin
          # Use OpenAI Whisper to transcribe
          client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
          
          # Download audio file temporarily
          audio_data = HTTParty.get(audio_url).body
          temp_file = Tempfile.new(['audio', '.m4a'])
          temp_file.binmode
          temp_file.write(audio_data)
          temp_file.rewind

          # Transcribe with Whisper
          response = client.audio.transcribe(
            parameters: {
              model: 'whisper-1',
              file: temp_file
            }
          )

          temp_file.close
          temp_file.unlink

          transcript = response['text']
          
          # Calculate pronunciation score
          score = calculate_pronunciation_score(reference_text, transcript)
          feedback = generate_feedback(score)

          render json: {
            transcript: transcript,
            score: score,
            feedback: feedback
          }, status: :ok
        rescue => e
          Rails.logger.error "Evaluation error: #{e.message}"
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

