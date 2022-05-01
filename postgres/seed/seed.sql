BEGIN TRANSACTION;

INSERT INTO users(name, email, entries, joined) VALUES('Tim', 'Tim@gmail.com', 5, '2018-01-01');
INSERT INTO login(hash, email) VALUES('$2a$12$FXnwsgYXCitGFNMdFeUx8Ox1ZKhShvkXlVnq1mn6ilGu7g71aQ4Lm', 'Tim@gmail.com');

COMMIT;