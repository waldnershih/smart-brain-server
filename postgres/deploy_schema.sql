-- Deploy fresh db tables
-- \i -> exec script
\i 'docker-entrypoint-initdb.d/tables/users.sql'
\i 'docker-entrypoint-initdb.d/tables/login.sql'

\i 'docker-entrypoint-initdb.d/seed/seed.sql'