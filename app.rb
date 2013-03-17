# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'bundler'
Bundler.require

# Setup DataMapper with a database URL. On Heroku, ENV['DATABASE_URL'] will be
# set, when working locally this line will fall back to using SQLite in the
# current directory.
DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite://#{Dir.pwd}/development.sqlite")

# Define a simple DataMapper model.
class Thing
  include DataMapper::Resource

  property :id, Serial, :key => true
  property :created_at, DateTime
  property :title, String, :length => 255
  property :description, Text
end

# Finalize the DataMapper models.
DataMapper.finalize

# Tell DataMapper to update the database according to the definitions above.
DataMapper.auto_upgrade!

get '/' do
  erb :index
end

# Route to show all Things, ordered like a blog
get '/things' do
  @things = Thing.all(:order => :created_at.desc)
  erb :things_index
end

# Route to show form to create a new Thing
get '/things/new' do
  erb :things_new
end

# Route to create a new Thing
post '/things/new' do
  @thing = Thing.new(params)
  @thing.save
  redirect '/things'
end

# Route to show a specific Thing based on its `id`
get '/things/:id' do
  @thing = Thing.get(params[:id])
  erb :things_show
end

# Route for the form to edit a Thing
get '/things/:id/edit' do
  @thing = Thing.get(params[:id])
  erb :things_edit
end

# Route to update a Thing
post '/things/:id/update' do
  @thing = Thing.get(params[:id])
  @thing.update(:title => params[:title], :description => params[:description])
  @thing.save
  redirect "/things/#{params[:id]}"
end

# Route to delete a Thing
get '/things/:id/delete' do
  Thing.get(params[:id]).destroy
  redirect '/things'
end
