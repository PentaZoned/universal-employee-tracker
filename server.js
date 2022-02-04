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

var departmentArray = ["Sales", "Engineering", "Finance", "Legal"];
var roleArray = ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"];
var employeeArray = ["John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik", "Kunal Singh", "Malia Brown", "Sarah Lourd", "Tom Allen"];

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

function addDepartmentQuery() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([{
                type: "input",
                message: "What is the name of the department you want to add?",
                name: "departmentName",
            }, ])
            .then((data) => {
                db.query(`INSERT INTO department (name)
                    VALUES (?);`, data.departmentName, function (err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
    });
};

async function addDepartment() {
    try {
        const result = await addDepartmentQuery();
        console.log("Department has been created.");
        repeatInquirer();
    } catch (err) {
        console.log(error);
    }
};

function addRoleQuery() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([{
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
                    type: "list",
                    message: "What is the department id of the role?",
                    choices: roleArray,
                    name: "roleDept",
                },
            ])
            .then((data) => {

                var newSalary = parseInt(data.roleSalary);
                var deptSelect;

                for(var i = 0; i < roleArray.length; i++){
                    if(data.roleDept === roleArray[i]) {
                        deptSelect = i + 1;
                    }
                };
                db.query(`INSERT INTO role (title, salary, department_id)
                    VALUES ("${data.roleTitle}", ${newSalary}, ${deptSelect});`, function (err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
    });
};

async function addRole() {
    try {
        const result = await addRoleQuery();
        console.log("Role has been created.");
        repeatInquirer();
    } catch (err) {
        console.log(error);
    }
};

function addEmployeeQuery() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([{
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
                    type: "list",
                    message: "What is the role of the employee?",
                    choices: roleArray,
                    name: "empRole",
                },
                {
                    type: "list",
                    message: "Who is the manager of this employee?",
                    choices: employeeArray,
                    name: "empManager",
                },
            ])
            .then((data) => {

                var roleSelect;

                for(var i = 0; i < roleArray.length; i++){
                    if(data.empRole === roleArray[i]) {
                        roleSelect = i + 1;
                    }
                };

                var managerSelect;

                for(var i = 0; i < employeeArray.length; i++){
                    if(data.empManager === employeeArray[i]) {
                        managerSelect = i + 1;
                    }
                };

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                     VALUES ("${data.firstName}", "${data.lastName}", ${roleSelect}, ${managerSelect});`, function (err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
    });
};

async function addEmployee() {
    try {
        const result = await addEmployeeQuery();
        console.log("Employee has been added.");
        repeatInquirer();
    } catch (err) {
        console.log(error);
    }
};

function updateRoleQuery() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([{
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
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
    });
};

async function updateRole() {
    try {
        const result = await updateRoleQuery();
        console.log("Employee's role has been updated.");
        repeatInquirer();
    } catch (err) {
        console.log(error);
    }
}

repeatInquirer();