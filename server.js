// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Establish a connection to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log("Connected to the database.")
);

// Inquirer function to prompt the user questions  and retrieve user input
inquirer
    .prompt([
        // The first question shown to the user
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
            name: "userChoice"
        }
    ])
    .then((data) => {                                   // Manipulate the data retrieved
        if(data.userChoice === "View All Employees") {
            viewEmployees();
        }
    });

// This function shows all of the current employees and their information
function viewEmployees() {
    db.query('SELECT e.id AS Id, e.first_name AS First_Name, e.last_name as Last_name, r.title as Title, d.name AS Department, r.salary as Salary, e.manager_id AS Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;', function (err, results) {
        console.table(results);
    });
};