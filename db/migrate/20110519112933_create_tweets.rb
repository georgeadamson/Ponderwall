class CreateTweets < ActiveRecord::Migration
  def self.up
    create_table :tweets do |t|
      t.integer :id
      t.string :from_user
      t.string :profile_image_url
      t.string :text
      t.string :source
      t.datetime :created_at

      t.timestamps
    end
  end

  def self.down
    drop_table :tweets
  end
end
