Rails.application.routes.draw do

  get 'password_resets/new'

  get 'password_resets/edit'

  root   'landing_pages#home'
  get    '/storylist'          => 'landing_pages#storylist'
  get    'signup'              => 'users#new'
  post   'signup'              => 'users#create'
  get    'login'               => 'sessions#new'
  post   'login'               => 'sessions#create'
  delete 'logout'              => 'sessions#destroy'
  get    'newstory'            => 'stories#new'
  get    'scripts/newnavbar'   => 'navbar#new'
  get    'bookmarks'           => 'bookmarks#show'
  get    'bookmarks/ids'       => 'bookmarks#index'
  post   'bookmarks/:story_id' => 'bookmarks#create'
  delete 'bookmarks/:story_id' => 'bookmarks#destroy'
  get    'stories/random'      => 'stories#random', as: 'random_story'
  get    'contact'             => 'contact_form#show'
  post   'contact'             => 'contact_form#send_mail', as: 'contact_form'
  get    'sendmail'            => 'contact_form#send_mail'
  
  resources :stories,             only: [:index, :show, :new, :create, :destroy]
  resources :users,               only: [:index, :show, :new, :create, :destroy]
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update, :index]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
