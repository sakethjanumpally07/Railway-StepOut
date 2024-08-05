CREATE DATABASE railway_management;
\c railway_management

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL
);

CREATE TABLE trains (
  id SERIAL PRIMARY KEY,
  train_name VARCHAR(100) NOT NULL,
  source VARCHAR(50) NOT NULL,
  destination VARCHAR(50) NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  train_id INT REFERENCES trains(id),
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
