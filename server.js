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

// Holds the departments, roles, and employees into arrays for the prompts
// If running the application without using the seeds.sql then set these arrays to empty
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
        .then((data) => {                                               // Manipulate the data retrieved
            if (data.userChoice === "View All Departments") {           // Based on the user's input, process the following functions
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
            } else {                                                    // This will exit the program
                console.log("Press Ctrl + C to exit out of Node.");     
                return;
            }
        });
};

// This function will process the query that displays the department table with its current data values
function viewDepartments() {
    db.query('SELECT id AS Id, name as Name FROM department;', function (err, results) {
        // console.table package is used to format the results into an organized table for the user to view
        console.table(results);
        // Repeat the first prompt to ask the user for their next action
        repeatInquirer();
    });
};

// This function will process the query that displays the role table with its current data values
function viewRoles() {
    db.query(`SELECT role.id AS Id, role.title AS Title, department.name AS Department, role.salary AS Salary
                FROM role
                LEFT JOIN department ON role.department_id = department.id;`, function (err, results) {
        console.table(results);
        repeatInquirer();
    });
};

// This function returns a promise that has the contents of the query
function viewEmployeesQuery() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT employee.id AS Id, employee.first_name AS First_Name, employee.last_name as Last_name,
                    role.title as Title, department.name AS Department, role.salary as Salary,
                    CONCAT(manager.first_name, " ", manager.last_name) AS Manager
                    FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`, function (err, results) {
            if (err) {                      // If there is an error, reject the promise and return an error
                return reject(err);
            }
            return resolve(results);        // Return the output of the query with the promise
        });
    });
};

// This function will process the query that displays the employee table with its current data values
// It is an async function so the query will run and output the table before the prompt is repeated
async function viewEmployee() {
    try {
        const result = await viewEmployeesQuery();      // Ensures the query will be processed before any further action
        console.table(result);                          // Format the result into a table
        repeatInquirer();                               // Repeat the initial prompt
    } catch (error) {                                   // If there is an error, console log the error
        console.log(error)
    }
};

// This function returns a promise that has the contents of the query
function addDepartmentQuery() {
    return new Promise((resolve, reject) => {
        inquirer
            // New prompt for adding a department
            .prompt([{
                type: "input",
                message: "What is the name of the department you want to add?",
                name: "departmentName",
            }, ])
            .then((data) => {
                // Push the new department name to the back of the department array to be used for further actions
                departmentArray.push(data.departmentName);

                // Query to insert a department into the department table
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

// Async function so the query will run and output the table before the prompt is repeated
async function addDepartment() {
    try {
        const result = await addDepartmentQuery();      // Ensures the query will be processed before any further action
        console.log("Department has been created.");
        repeatInquirer();                               // Repeat the initial prompt
    } catch (err) {
        console.log(err);
    }
};

// This function returns a promise that has the contents of the query
function addRoleQuery() {
    return new Promise((resolve, reject) => {
        inquirer
            // New prompt for adding a role
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
                    message: "What is the department of the role?",
                    choices: departmentArray,        // Department array so the specific names are displayed and used
                    name: "roleDept",
                },
            ])
            .then((data) => {

                // Push the new role name to the back of the role array to be used for further actions
                roleArray.push(data.roleTitle);

                // Ensures the salary is an int
                var newSalary = parseInt(data.roleSalary);
                // Holds the id of a department
                var deptID;

                // Checks the department array where the user input matches the element and sets deptID to be the index value
                for(var i = 0; i < departmentArray.length; i++){
                    if(data.roleDept === departmentArray[i]) {
                        deptID = i + 1;
                    }
                };

                // Query to insert a role into the role table
                db.query(`INSERT INTO role (title, salary, department_id)
                    VALUES ("${data.roleTitle}", ${newSalary}, ${deptID});`, function (err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
    });
};

// Async function so the query will run and output the table before the prompt is repeated
async function addRole() {
    try {
        const result = await addRoleQuery();        // Ensures the query will be processed before any further action
        console.log("Role has been created.");
        repeatInquirer();                           // Repeat the initial prompt
    } catch (err) {
        console.log(err);
    }
};

// This function returns a promise that has the contents of the query
function addEmployeeQuery() {
    return new Promise((resolve, reject) => {
        inquirer                
            // New prompt for adding an employee
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

                // Push the new employee name to the back of the employee array to be used for further actions
                employeeArray.push(data.firstName + " " + data.lastName);

                // Holds the id of a role
                var roleID;

                // Checks the role array where the user input matches the element and sets roleID to be the index value
                for(var i = 0; i < roleArray.length; i++){
                    if(data.empRole === roleArray[i]) {
                        roleID = i + 1;
                    }
                };

                // Holds the id of a manager
                var managerID;

                // Checks the employee array where the user input matches the element and sets managerID to be the index value
                for(var j = 0; j < employeeArray.length; j++){
                    if(data.empManager === employeeArray[j]) {
                        managerID = j + 1;
                    }
                };

                // Query to insert an employee into the employee table
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                     VALUES ("${data.firstName}", "${data.lastName}", ${roleID}, ${managerID});`, function (err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
    });
};

// Async function so the query will run and output the table before the prompt is repeated
async function addEmployee() {
    try {
        const result = await addEmployeeQuery();        // Ensures the query will be processed before any further action
        console.log("Employee has been added.");
        repeatInquirer();                               // Repeat the initial prompt
    } catch (err) {
        console.log(err);
    }
};

// This function returns a promise that has the contents of the query
function updateRoleQuery() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([{
                    type: "list",
                    message: "Which employee do you want to update their role for?",
                    choices: employeeArray,
                    name: "specEmployee",
                },
                {
                    type: "list",
                    message: "What is the new role of the employee?",
                    choices: roleArray,
                    name: "specRole",
                },
            ])
            .then((data) => {
                // Holds the id of the employee
                var empID;

                // Checks the employee array where the user input matches the element and sets empID to be the index value
                for(var i = 0; i < employeeArray.length; i++){
                    if(data.specEmployee === employeeArray[i]) {
                        empID = i + 1;
                    }
                };

                // Holds the id of the role
                var roleID;

                // Checks the role array where the user input matches the element and sets roleID to be the index value
                for(var j = 0; j < roleArray.length; j++){
                    if(data.specRole === roleArray[j]) {
                        roleID = j + 1;
                    }
                };

                // Query to update the role of an employee
                db.query(`UPDATE employee
                    SET role_id = ${roleID}
                    WHERE id = ?`, empID, function (err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
    });
};

// Async function so the query will run and output the table before the prompt is repeated
async function updateRole() {
    try {
        const result = await updateRoleQuery();             // Ensures the query will be processed before any further action
        console.log("Employee's role has been updated.");
        repeatInquirer();                                   // Repeat the initial prompt
    } catch (err) {
        console.log(err);
    }
}

// Runs the initial prompt at the start of the program
repeatInquirer();