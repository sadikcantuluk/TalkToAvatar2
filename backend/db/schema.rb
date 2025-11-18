# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_11_17_152948) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_graphql"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

  create_table "analyses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "course_id", null: false
    t.string "analysis_type", limit: 50, null: false
    t.jsonb "data", default: {}, null: false
    t.text "summary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["analysis_type"], name: "idx_analyses_type"
    t.index ["course_id"], name: "idx_analyses_course_id"
    t.index ["course_id"], name: "index_analyses_on_course_id"
  end

  create_table "audios", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.text "local_uri", null: false
    t.text "text", null: false
    t.text "translated_text"
    t.string "voice_type", limit: 100
    t.string "language_code", limit: 5
    t.string "avatar_name", limit: 100
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["language_code"], name: "idx_audios_language"
    t.index ["user_id"], name: "idx_audios_user_id"
  end

  create_table "conversations", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.text "user_text", null: false
    t.text "translated_text"
    t.string "user_language", limit: 5
    t.string "target_language", limit: 5
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["target_language"], name: "idx_conversations_target_language"
    t.index ["user_id"], name: "idx_conversations_user_id"
    t.index ["user_language"], name: "idx_conversations_user_language"
  end

  create_table "courses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "title", null: false
    t.text "description"
    t.string "language_code", limit: 5
    t.string "level", limit: 2
    t.string "status", limit: 20, default: "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["language_code"], name: "idx_courses_language_code"
    t.index ["level"], name: "idx_courses_level"
    t.index ["status"], name: "idx_courses_status"
    t.index ["user_id"], name: "idx_courses_user_id"
    t.index ["user_id"], name: "index_courses_on_user_id"
    t.check_constraint "level IS NULL OR (level::text = ANY (ARRAY['A1'::character varying::text, 'A2'::character varying::text, 'B1'::character varying::text, 'B2'::character varying::text, 'C1'::character varying::text, 'C2'::character varying::text]))", name: "courses_level_check"
    t.check_constraint "status::text = ANY (ARRAY['active'::character varying::text, 'completed'::character varying::text, 'archived'::character varying::text])", name: "courses_status_check"
  end

  create_table "custom_avatars", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.text "local_uri", null: false
    t.string "avatar_name", limit: 255, null: false
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["user_id"], name: "idx_custom_avatars_user_id"
  end

  create_table "email_verifications", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "code", limit: 6, null: false
    t.timestamptz "expires_at", null: false
    t.boolean "verified", default: false, null: false
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["code"], name: "idx_email_verifications_code"
    t.index ["user_id"], name: "idx_email_verifications_user_id"
  end

  create_table "notifications", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "title", limit: 255, null: false
    t.text "message", null: false
    t.string "type", limit: 50, default: "info"
    t.boolean "read", default: false
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["created_at"], name: "idx_notifications_created_at", order: :desc
    t.index ["read"], name: "idx_notifications_read"
    t.index ["user_id", "read"], name: "idx_notifications_user_read"
    t.index ["user_id"], name: "idx_notifications_user_id"
    t.check_constraint "type::text = ANY (ARRAY['success'::character varying, 'error'::character varying, 'info'::character varying, 'warning'::character varying, 'video_ready'::character varying]::text[])", name: "notifications_type_check"
  end

  create_table "password_resets", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "token", limit: 255, null: false
    t.timestamptz "expires_at", null: false
    t.boolean "used", default: false, null: false
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["token"], name: "idx_password_resets_token"
    t.index ["user_id"], name: "idx_password_resets_user_id"
    t.unique_constraint ["token"], name: "password_resets_token_key"
  end

  create_table "practice_sentences", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "language_code", limit: 2, null: false
    t.string "level", limit: 2, null: false
    t.string "topic", limit: 50, null: false
    t.text "sentence", null: false
    t.integer "order", null: false
    t.datetime "created_at", precision: nil, default: -> { "now()" }
    t.datetime "updated_at", precision: nil, default: -> { "now()" }
    t.index ["language_code", "level", "topic"], name: "idx_practice_sentences_composite"
    t.index ["language_code"], name: "idx_practice_sentences_language"
    t.index ["level"], name: "idx_practice_sentences_level"
    t.index ["topic"], name: "idx_practice_sentences_topic"
    t.check_constraint "level::text = ANY (ARRAY['A1'::character varying, 'A2'::character varying, 'B1'::character varying, 'B2'::character varying, 'C1'::character varying, 'C2'::character varying]::text[])", name: "practice_sentences_level_check"
  end

  create_table "recordings", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.text "local_uri", null: false
    t.text "transcript"
    t.text "reference_text"
    t.decimal "score", precision: 5, scale: 2
    t.string "level", limit: 2
    t.string "language_code", limit: 5
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.float "accuracy", default: 0.0
    t.float "fluency", default: 0.0
    t.float "completeness", default: 0.0
    t.jsonb "words", default: []
    t.uuid "course_id"
    t.uuid "practice_sentence_id"
    t.string "topic"
    t.index ["course_id", "topic"], name: "index_recordings_on_course_id_and_topic"
    t.index ["course_id"], name: "idx_recordings_course_id"
    t.index ["course_id"], name: "index_recordings_on_course_id"
    t.index ["language_code"], name: "idx_recordings_language"
    t.index ["level"], name: "idx_recordings_level"
    t.index ["practice_sentence_id", "created_at"], name: "index_recordings_on_practice_sentence_id_and_created_at"
    t.index ["practice_sentence_id"], name: "index_recordings_on_practice_sentence_id"
    t.index ["user_id"], name: "idx_recordings_user_id"
    t.check_constraint "level::text = ANY (ARRAY['A1'::character varying, 'A2'::character varying, 'B1'::character varying, 'B2'::character varying, 'C1'::character varying, 'C2'::character varying]::text[])", name: "recordings_level_check"
  end

  create_table "reports", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "course_id", null: false
    t.string "title", null: false
    t.text "content", null: false
    t.string "report_type", limit: 50, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "idx_reports_course_id"
    t.index ["course_id"], name: "index_reports_on_course_id"
    t.index ["report_type"], name: "idx_reports_type"
  end

  create_table "sentence_banks", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "level", limit: 2, null: false
    t.string "language_code", limit: 5, null: false
    t.text "sentence", null: false
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["language_code"], name: "idx_sentence_banks_language"
    t.index ["level"], name: "idx_sentence_banks_level"
    t.check_constraint "level::text = ANY (ARRAY['A1'::character varying, 'A2'::character varying, 'B1'::character varying, 'B2'::character varying, 'C1'::character varying, 'C2'::character varying]::text[])", name: "sentence_banks_level_check"
  end

  create_table "subjects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "course_id", null: false
    t.string "title", null: false
    t.text "description"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id", "order"], name: "idx_subjects_course_order"
    t.index ["course_id"], name: "idx_subjects_course_id"
    t.index ["course_id"], name: "index_subjects_on_course_id"
  end

  create_table "user_course_progress", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "course_id", null: false
    t.uuid "sentence_id", null: false
    t.boolean "completed", default: false
    t.float "score"
    t.integer "attempts", default: 0
    t.float "best_score"
    t.datetime "last_practiced_at", precision: nil
    t.datetime "created_at", precision: nil, default: -> { "now()" }
    t.datetime "updated_at", precision: nil, default: -> { "now()" }
    t.index ["course_id"], name: "idx_user_course_progress_course"
    t.index ["sentence_id"], name: "idx_user_course_progress_sentence"
    t.index ["user_id", "course_id"], name: "idx_user_course_progress_composite"
    t.index ["user_id"], name: "idx_user_course_progress_user"
    t.unique_constraint ["user_id", "course_id", "sentence_id"], name: "user_course_progress_user_id_course_id_sentence_id_key"
  end

  create_table "user_course_progresses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "course_id", null: false
    t.uuid "practice_sentence_id", null: false
    t.boolean "completed", default: false
    t.float "score"
    t.integer "attempts", default: 0
    t.float "best_score"
    t.datetime "last_practiced_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_user_course_progresses_on_course_id"
    t.index ["practice_sentence_id"], name: "index_user_course_progresses_on_practice_sentence_id"
    t.index ["user_id"], name: "index_user_course_progresses_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "username", limit: 255, null: false
    t.string "email", limit: 255, null: false
    t.string "password_digest", limit: 255, null: false
    t.boolean "email_verified", default: false, null: false
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["email"], name: "idx_users_email"
    t.index ["username"], name: "idx_users_username"
    t.unique_constraint ["email"], name: "users_email_key"
    t.unique_constraint ["username"], name: "users_username_key"
  end

  create_table "videos", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.text "local_uri"
    t.jsonb "avatar_info"
    t.text "text", null: false
    t.jsonb "audio_info"
    t.string "status", limit: 20, default: "processing"
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.uuid "course_id"
    t.index ["course_id"], name: "idx_videos_course_id"
    t.index ["course_id"], name: "index_videos_on_course_id"
    t.index ["status"], name: "idx_videos_status"
    t.index ["user_id"], name: "idx_videos_user_id"
    t.check_constraint "status::text = ANY (ARRAY['processing'::character varying, 'completed'::character varying, 'failed'::character varying]::text[])", name: "videos_status_check"
  end

  add_foreign_key "analyses", "courses"
  add_foreign_key "audios", "users", name: "audios_user_id_fkey", on_delete: :cascade
  add_foreign_key "conversations", "users", name: "conversations_user_id_fkey", on_delete: :cascade
  add_foreign_key "courses", "users"
  add_foreign_key "custom_avatars", "users", name: "custom_avatars_user_id_fkey", on_delete: :cascade
  add_foreign_key "email_verifications", "users", name: "email_verifications_user_id_fkey", on_delete: :cascade
  add_foreign_key "notifications", "users", name: "notifications_user_id_fkey", on_delete: :cascade
  add_foreign_key "password_resets", "users", name: "password_resets_user_id_fkey", on_delete: :cascade
  add_foreign_key "recordings", "courses"
  add_foreign_key "recordings", "users", name: "recordings_user_id_fkey", on_delete: :cascade
  add_foreign_key "reports", "courses"
  add_foreign_key "subjects", "courses"
  add_foreign_key "user_course_progress", "courses", name: "user_course_progress_course_id_fkey", on_delete: :cascade
  add_foreign_key "user_course_progress", "practice_sentences", column: "sentence_id", name: "user_course_progress_sentence_id_fkey", on_delete: :cascade
  add_foreign_key "user_course_progress", "users", name: "user_course_progress_user_id_fkey", on_delete: :cascade
  add_foreign_key "user_course_progresses", "courses"
  add_foreign_key "user_course_progresses", "practice_sentences"
  add_foreign_key "user_course_progresses", "users"
  add_foreign_key "videos", "courses"
  add_foreign_key "videos", "users", name: "videos_user_id_fkey", on_delete: :cascade
end
