
INSERT INTO movie_users (username, email, user_password, user_role, refreshToken, reservations)
VALUES
  ('john_doe', 'john@example.com', 'hashedpassword1', 'user', NULL,'[]'::jsonb)
  
  ('mike_ross', 'mike@example.com', 'hashedpassword3', 'user', NULL, '[]'::jsonb),
  ('rachel_green', 'rachel@example.com', 'hashedpassword4', 'user', NULL, '[{"movie": "Matrix", "seat": "B4"}, {"movie": "Avatar", "seat": "C2"}]'::jsonb),
  ('harvey_specter', 'harvey@example.com', 'hashedpassword5', 'admin', NULL, '[]'::jsonb),
  ('donna_paulsen', 'donna@example.com', 'hashedpassword6', 'user', NULL, '[{"movie": "Titanic", "seat": "D5"}]'::jsonb),
  ('louis_litt', 'louis@example.com', 'hashedpassword7', 'user', NULL, '[]'::jsonb),
  ('phoebe_buffay', 'phoebe@example.com', 'hashedpassword8', 'user', NULL, '[{"movie": "Frozen", "seat": "E3"}]'::jsonb),
  ('monica_geller', 'monica@example.com', 'hashedpassword9', 'user', NULL, '[]'::jsonb),
  ('ross_geller', 'ross@example.com', 'hashedpassword10', 'user', NULL, '[{"movie": "Jurassic Park", "seat": "F1"}]'::jsonb);

('jane_smith', 'jane@example.com', 'hashedpassword2', 'admin', NULL, '[{"movie": "Inception", "seat": "A10"}]'::jsonb),
-- use views!!
-- use functions

-- CREATE SCHEMA movie_reservation; 

ADD CONSTRAINT movie_id_unique UNIQUE (movie_id)
CREATE TABLE movie_users (
    id VARCHAR(100) NOT NULL,
    username   VARCHAR(50) NOT NULL,
    email   VARCHAR(150) NOT NULL,
    user_password  VARCHAR(100) NOT NULL,
    user_role  VARCHAR(50) DEFAULT 'user',
    refreshToken  VARCHAR(100),
    reservations  JSONB,
    UNIQUE (id,email)
);

#########
CREATE TABLE movies (
  movie_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  release_date date,
  description VARCHAR(120),
  genre VARCHAR(50) NOT NULL,
  seats_remaining integer NOT NULL,
  total_seats integer NOT NULL,
  thumbnail VARCHAR(200),
  UNIQUE(movie_id,title)
  -- metadata JSONB, //likes
)

############
CREATE TABLE payment_details (
  -- payment_id VARCHAR(100) NOT NULL PRIMARY KEY,
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  movie_id UUID,
  seat VARCHAR(20),
  total_payment INT NOT NULL,
  payment_status VARCHAR(20),
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES movie_users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
)

######
-- CREATE TABLE movie_payment_details (
  
-- );




