class CreateEmailVerifications < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:email_verifications)
      create_table :email_verifications, id: :uuid do |t|
        t.references :user, null: false, foreign_key: true, type: :uuid
        t.string :code, null: false
        t.datetime :expires_at, null: false
        t.boolean :verified, default: false, null: false
        
        t.timestamps
      end

      add_index :email_verifications, :code unless index_exists?(:email_verifications, :code)
    end
  end
end

