class CreateAnalyses < ActiveRecord::Migration[7.1]
  def change
    create_table :analyses, id: :uuid do |t|
      t.references :course, null: false, foreign_key: true, type: :uuid
      t.string :analysis_type, null: false, limit: 50
      t.jsonb :data, null: false, default: {}
      t.text :summary

      t.timestamps
    end
    
    add_index :analyses, :course_id, name: 'idx_analyses_course_id'
    add_index :analyses, :analysis_type, name: 'idx_analyses_type'
  end
end
