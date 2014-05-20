DataMapper.setup(:default, ENV['DATABASE_URL'] || "postgres://localhost/sinatra-test")

class Project
 	include DataMapper::Resource

 	property :id, Serial
 	property :name, String
 	property :slug, String
 	property :date, DateTime
 	property :picture, String

end

DataMapper.finalize
#DataMapper.auto_upgrade!