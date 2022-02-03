const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log("Connected to the database.")
);

inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
            name: "userChoice"
        }
    ])
    .then((data) => {
        if(data.userChoice === "View All Employees") {
            viewEmployees();
        }
    });

function viewEmployees() {
    db.query('SELECT first_name, last_name FROM employee LEFT JOIN role ON employee.role_id = role.id;', function (err, results) {
        console.log(results);
    });
};