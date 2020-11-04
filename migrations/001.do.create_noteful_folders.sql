CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE folders (
   id uuid DEFAULT uuid_generate_v4 (),
   name TEXT NOT NULL,
   PRIMARY KEY (id)
);