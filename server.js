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
                viewEmployees();
            } else if (data.userChoice === "Add Department") {

            } else if (data.userChoice === "Add Role") {
                
            } else if (data.userChoice === "Add Employee") {
            
            } else if (data.userChoice === "Update Employee's Role") {
                
            } else {
                console.log("Press Ctrl + C to exit out of Node.");
                return;
            }
        });
}

function viewDepartments() {
    db.query('SELECT id AS Id, name as Name FROM department;', function(err, results) {
        console.table(results);
    });
};

function viewRoles() {
    db.query('SELECT id AS Id, title AS Title, Salary AS Salary, department_id AS Department_Id FROM role;', function(err, results) {
        console.table(results);
    });
};


// This function shows all of the current employees and their information
function viewEmployees() {
    db.query('SELECT e.id AS Id, e.first_name AS First_Name, e.last_name as Last_name, r.title as Title, d.name AS Department, r.salary as Salary, e.manager_id AS Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;', function (err, results) {
        console.table(results);
    });
    repeatInquirer();
};

repeatInquirer();