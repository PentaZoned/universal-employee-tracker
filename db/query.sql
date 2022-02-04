SELECT employee.id AS Id, employee.first_name AS First_Name, employee.last_name as Last_name, role.title as Title, department.name AS Department, role.salary as Salary, manager.first_name AS Manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;