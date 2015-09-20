class User < ActiveRecord::Base
  validates :name, presence: true
  validates :email, presence: true
  validates :facebook_id, presence: true, uniqueness: true
end
