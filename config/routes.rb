Rails.application.routes.draw do
  get 'home/index'

  resources :users, only: [:update] do
  end

  root to: 'home#index'
end
