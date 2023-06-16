CREATE USER 'assignment_db'@'localhost' IDENTIFIED BY 'Abcd1234';

GRANT ALL PRIVILEGES ON *.* TO 'assignment_db'@'localhost' WITH GRANT OPTION;

CREATE USER 'assignment_db'@'%' IDENTIFIED BY 'Abcd1234';

GRANT ALL PRIVILEGES ON *.* TO 'assignment_db'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
