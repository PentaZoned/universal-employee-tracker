SELECT
 e.id AS Id, e.first_name AS First_Name, e.last_name as Last_name, r.title as Title, d.name AS Department, r.salary as Salary, e.manager_id AS Manager
FROM employee e 
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id;
