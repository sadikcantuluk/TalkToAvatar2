class AddDetailsToRecordings < ActiveRecord::Migration[7.1]
  def change
    add_column :recordings, :accuracy, :float, default: 0.0
    add_column :recordings, :fluency, :float, default: 0.0
    add_column :recordings, :completeness, :float, default: 0.0
    add_column :recordings, :words, :jsonb, default: []
  end
end
