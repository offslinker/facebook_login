class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :facebook_id, null: false

      t.timestamps null: false
    end

    add_index :users, :facebook_id, unique: true
  end
end
