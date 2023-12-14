
-- init.sql

CREATE DATABASE db;

\c db;

CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        isadmin BOOLEAN NOT NULL,
        UNIQUE(email)
    );