CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;


CREATE TABLE folders (
  id uuid DEFAULT uuid_generate_v4 (),
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE notes (
  id uuid DEFAULT uuid_generate_v4 (),
  name TEXT NOT NULL,
  modified TIMESTAMP DEFAULT now() NOT NULL,
  folder_id uuid REFERENCES folders(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  PRIMARY KEY (id)
);