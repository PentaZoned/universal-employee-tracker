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

function viewEmployeesQuery(){
    return new Promise((resolve, reject) => {
        db.query(`SELECT employee.id AS Id, employee.first_name AS First_Name, employee.last_name as Last_name, role.title as Title, department.name AS Department, role.salary as Salary, manager.first_name AS Manager
                    FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`, function (err, results) {
            if(err) {
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
    } catch(error) {
        console.log(error)
    }
}

repeatInquirer();