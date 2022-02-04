// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Establish a connection to the database
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log("Connected to the database.")
);

// Inquirer function to prompt the user questions  and retrieve user input
function repeatInquirer() {
    inquirer
        .prompt([
            // The first question shown to the user
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee's Role", "Quit"],
                name: "userChoice"
            },
        ])
        .then((data) => { // Manipulate the data retrieved
            if (data.userChoice === "View All Departments") {
                viewDepartments();
            } else if (data.userChoice === "View All Roles") {
                viewRoles();
            } else if (data.userChoice === "View All Employees") {
                viewEmployee();
            } else if (data.userChoice === "Add Department") {
                addDepartment();
            } else if (data.userChoice === "Add Role") {
                addRole();
            } else if (data.userChoice === "Add Employee") {
                addEmployee();
            } else if (data.userChoice === "Update Employee's Role") {
                updateRole();
            } else {
                console.log("Press Ctrl + C to exit out of Node.");
                return;
            }
        });
};

function viewDepartments() {
    db.query('SELECT id AS Id, name as Name FROM department;', function (err, results) {
        console.table(results);
        repeatInquirer();
    });
};

function viewRoles() {
    db.query(`SELECT role.id AS Id, role.title AS Title, department.name AS Department, role.salary AS Salary
                FROM role
                LEFT JOIN department ON role.department_id = department.id;`, function (err, results) {
        console.table(results);
        repeatInquirer();
    });
};

function viewEmployeesQuery() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT employee.id AS Id, employee.first_name AS First_Name, employee.last_name as Last_name,
                    role.title as Title, department.name AS Department, role.salary as Salary,
                    CONCAT(manager.first_name, " ", manager.last_name) AS Manager
                    FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`, function (err, results) {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

async function viewEmployee() {
    try {
        const result = await viewEmployeesQuery();
        console.table(result);
        repeatInquirer();
    } catch (error) {
        console.log(error)
    }
};

function addDepartment() {
    inquirer
        .prompt([
            {
            type: "input",
            message: "What is the name of the department you want to add?",
            name: "departmentName",
            },
        ])
        .then((data) => {
            db.query(`INSERT INTO department (name)
                    VALUES (?);`, data.departmentName, function (err, results) {
                console.log("Department added.");
            });
            repeatInquirer();
        });
};

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the title of the role you want to add?",
                name: "roleTitle",
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary",
            },
            {
                type: "input",
                message: "What is the department id of the role?",
                name: "roleDeptId",
            },
        ])
        .then((data) => {

            var newSalary = parseInt(data.roleSalary);
            var newDeptId = parseInt(data.roleDeptId);
            db.query(`INSERT INTO role (title, salary, department_id)
                    VALUES ("${data.roleTitle}", ${newSalary}, ${newDeptId});`, function (err, results) {
                    if(err) {
                        console.log(err);
                    }
                console.log("Role added.");
            });
            repeatInquirer();
        });
};

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the first name of the employee you want to add?",
                name: "firstName",
            },
            {
                type: "input",
                message: "What is the last name?",
                name: "lastName",
            },
            {
                type: "input",
                message: "What is the role id of the employee?",
                name: "roleId",
            },
            {
                type: "input",
                message: "What is the manager id of the employee?",
                name: "managerId",
            },
        ])
        .then((data) => {

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                     VALUES ("${data.firstName}", "${data.lastName}", ${data.roleId}, ${data.managerId});`, function (err, results) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Employee added.");
                }
            });
            repeatInquirer();
        });
};

function updateRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Give the id of the employee whose role you want to update.",
                name: "employeeId",
            },
            {
                type: "input",
                message: "What is the new role id of the employee?",
                name: "newRoleId",
            },
        ])
        .then((data) => {

            db.query(`UPDATE employee
                    SET role_id = ${data.newRoleId}
                    WHERE id = ?`, data.employeeId, function (err, results) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Employee profile updated.");
                }
            });
            repeatInquirer();
        });
};

repeatInquirer();