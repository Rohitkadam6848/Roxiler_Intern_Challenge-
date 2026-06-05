-- This is DATABASE use in this project but is not working file it is demo how the DATABASE works


CREATE DATABASE store_rating_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    address VARCHAR(400),

    role ENUM(
      'ADMIN',
      'USER',
      'STORE_OWNER'
    ) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE,

    address VARCHAR(400),

    owner_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);


CREATE TABLE ratings (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    store_id INT,

    rating INT CHECK (rating >= 1 AND rating <= 5),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (store_id)
    REFERENCES stores(id)
    ON DELETE CASCADE,

    UNIQUE(user_id, store_id)
);
