class CreatePasswordResets < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:password_resets)
      create_table :password_resets, id: :uuid do |t|
        t.references :user, null: false, foreign_key: true, type: :uuid
        t.string :token, null: false
        t.datetime :expires_at, null: false
        t.boolean :used, default: false, null: false
        
        t.timestamps
      end

      add_index :password_resets, :token, unique: true unless index_exists?(:password_resets, :token)
    end
  end
end

