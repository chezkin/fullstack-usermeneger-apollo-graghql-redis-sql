# #!/bin/bash
# set -e

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --pasword "$POSTGRES_PASSWORD" <<-EOSQL
# 	CREATE DATABASE users;

# CREATE TABLE IF NOT EXISTS users (
#         id SERIAL PRIMARY KEY,
#         firstname VARCHAR(255) NOT NULL,
#         lastname VARCHAR(255) NOT NULL,
#         email VARCHAR(255) NOT NULL,
#         password VARCHAR(255) NOT NULL,
#         isadmin BOOLEAN NOT NULL,
#         UNIQUE(email)
#     );
# EOSQL