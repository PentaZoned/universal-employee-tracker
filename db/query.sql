SELECT role.id AS Id, role.title AS Title, department.name AS Department, role.salary AS Salary
FROM role
LEFT JOIN department ON role.department_id = department.id;