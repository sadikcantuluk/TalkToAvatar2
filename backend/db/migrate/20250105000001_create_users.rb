class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:users)
      create_table :users, id: :uuid do |t|
        t.string :username, null: false
        t.string :email, null: false
        t.string :password_digest, null: false
        t.boolean :email_verified, default: false, null: false
        
        t.timestamps
      end

      add_index :users, :email, unique: true unless index_exists?(:users, :email)
      add_index :users, :username, unique: true unless index_exists?(:users, :username)
    end
  end
end

