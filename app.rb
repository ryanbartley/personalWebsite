# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'bundler'
Bundler.require
require './database.rb'

helpers do
  def render_erb(template)
    erb template, :layout => !request.xhr?
  end
end

get '/' do
	@page = 'home'
  	erb :index
end

get '/about' do
	@page = 'about'
	erb :about
end

get '/admin' do
	erb :admin
end

get '/projects' do
	@page = 'projects'
	erb :projects
end

get '/resume' do
	@page = 'resume'
	erb :resume
end

get '/pacman' do
	@page = 'pacman'
	erb :pacman
end

get '/contact' do
	@page = 'contact'
	erb :contact
end

get '/ajax/' do
	@page = 'home'
	render_erb :index
end

get '/ajax/about' do
	@page = 'about'
	render_erb :about
end

get '/ajax/projects' do
	@page = 'projects'
	render_erb :projects
end

get '/ajax/resume' do
	@page = 'resume'
	render_erb :resume
end

get '/ajax/contact' do
	@page = 'contact'
	render_erb :contact
end
