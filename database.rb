DataMapper.setup(:default, ENV['DATABASE_URL'] || "postgres://localhost/sinatra-test")

class Project
 	include DataMapper::Resource

 	property :id, Serial
 	property :name, String
 	property :preview_picture, String
 	property :preview_description, String

 	property :date_began, DateTime
 	property :date_finished, DateTime

 	property :full_project_slug, String
 	property :full_picture, String
 	property :full_description, String
 	property :external_link_language, String
 	property :external_project_slug, String
 	property :video_embed, String
 	property :company_name, String
 	property :company_website, String

	has n, :tags, :through => Resource

end

class Tag
  include DataMapper::Resource

  property :id, Serial
  property :name, String

  has n, :projects, :through => Resource
end

DataMapper.finalize
#DataMapper.auto_upgrade!