DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);

CREATE TABLE role (
    id INT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
    FOREIGN KEY (id)
    REFERENCES employee(role_id)
    ON DELETE SET NULL
);

CREATE TABLE department (
    id INT,
    name VARCHAR(30)
    FOREIGN KEY (id)
    REFERENCES role(department_id)
    ON DELETE SET NULL
);