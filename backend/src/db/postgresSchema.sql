CREATE DATABASE hookhaven;

CREATE TABLE bucket (
	id serial PRIMARY KEY,
	uuid text UNIQUE,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE request (
	id serial PRIMARY KEY, 
	bucket_id integer REFERENCES bucket(id) ON DELETE CASCADE,
	request_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  method VARCHAR(10) CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT')),
	url_path text,
	headers json,
	mongo_id char(24)
);

CREATE UNIQUE INDEX idx_bucket_uuid_id ON bucket(uuid, id);