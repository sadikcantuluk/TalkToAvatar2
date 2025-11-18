class CreateSubjects < ActiveRecord::Migration[7.1]
  def change
    create_table :subjects, id: :uuid do |t|
      t.references :course, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :description
      t.integer :order

      t.timestamps
    end
    
    add_index :subjects, :course_id, name: 'idx_subjects_course_id'
    add_index :subjects, [:course_id, :order], name: 'idx_subjects_course_order'
  end
end
