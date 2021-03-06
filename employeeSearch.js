// const inquirer = require('inquirer');

// function init() {
//     inquirer
//         .prompt({
//             name: "action",
//             type: "list",
//             message: "What would you like to do?",
//             choices: [
//                 "View All Employees",
//                 "View All Employees by Department",
//                 "View All Employees by Manager",
//                 "Add Employee",
//                 "Exit"
//             ]
//         })
//         .then(function (answer) {
//             switch (answer.action) {
//                 case "View All Employees":
//                     viewAllEmployees();
//                     break;

//                 case "View All Employees by Department":
//                     viewEmployeeDept();
//                     break;

//                 case "View All Employees by Manager":
//                     viewEmployeeMgr(connection);
//                         break;

//                 case "Add Employee":
//                     addEmployee(connection);
//                         break;

//                 case "Exit":
//                     connection.end();
//                     break;
//             }
//         })
// }

// function viewAllEmployees(connection) {
//     let query = "SELECT * FROM employee";
//     connection.query(query, function (err, res) {
//         if (err) throw err;
//         console.table(res);
//         init()
//     });
// };

// function viewEmployeeDept(connection) {
//     // Query the database for all available departments to prompt user
//     connection.query("SELECT * FROM department", function (err, results) {
//         if (err) throw err;
//         inquirer
//             .prompt([
//                 {
//                     name: "department",
//                     type: "list",
//                     choices: function () {
//                         let choiceArray = [];
//                         for (var i = 0; i < results.length; i++) {
//                             choiceArray.push(results[i].name);
//                         }
//                         return choiceArray;
//                     },
//                     message: "What department would you like to search by?"
//                 }
//             ])
//             .then(function (answer) {
//                 console.log(answer.department);
//                     let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, emp.first_name AS manager FROM employee LEFT JOIN employee as emp ON emp.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id'
//                     connection.query(query, answer.department, function (err, res) {
//                         if (err) throw err;
//                     console.table(res);
//                     init()
//                 });
//             });
//     });
// };

// function viewEmployeeMgr(connection) {
  
//     connection.query("SELECT DISTINCT employee.first_name, employee.last_name FROM employee WHERE employee.first_name IS NOT NULL", function (err, results) {
//         if (err) throw err;
//         inquirer
//             .prompt([
//                 {
//                     name: "manager",
//                     type: "list",
//                     choices: function () {
//                         let choiceArray = [];
//                         for (var i = 0; i < results.length; i++) {
//                             choiceArray.push(results[i].first_name);
//                         }
//                         return choiceArray;
//                     },
//                     message: "Which manager would you like to search by?"
//                 }
//             ])
//             .then(function (answer) {
//                 console.log(answer.manager);
//                 let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, emp.first_name AS manager FROM employee LEFT JOIN employee AS emp ON emp.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE emp.first_name = ? ORDER BY employee.id;'
//                 connection.query(query, answer.manager, function (err, res) {
//                     if (err) throw err;
//                     console.table(res);
//                     init()
//                 });
//             });
//     });
// };

// function addEmployee(connection) {
//     let newEmployee = {};
//     connection.query("SELECT * FROM role", function (err, results) {
//         if (err) throw err;
//         inquirer
//             .prompt([
//                 {
//                     name: "first_name",
//                     type: "input",
//                     message: "What is the employee's first name?",
//                     validate: function (answer) {
//                         if (answer.length == 0) {
//                             return console.log("A valid first name is required.");
//                         }
//                         return true;
//                     }
//                 },
//                 {
//                     name: "last_name",
//                     type: "input",
//                     message: "What is the employee's last name?",
//                     validate: function (answer) {
//                         if (answer.length == 0) {
//                             return console.log("A valid last name is required.");
//                         }
//                         return true;
//                     }
//                 },
//                 {
//                     name: "role",
//                     type: "list",
//                     choices:["Assistant to the Regional Manager",
//                     "Regional Manager",
//                     "Accountant",
//                     "HR Associate",
//                     "Software Engineer",
//                     "Administrative Professional",
//                     "Manager",
//                     "Quality Control Associate",
//                     "Sales Representative"
//                 ],
//                     message: "What is the employee's role?"
//                 }
//             ])
//             .then(function (answer) {

//                 newEmployee.first_name = answer.first_name;
//                 newEmployee.last_name = answer.last_name;

//                 connection.query("SELECT * FROM role WHERE title = ?", answer.role, function (err, results) {
//                     if (err) throw err;

//                     newEmployee.role_id = results[0].id;

//                     connection.query("SELECT * FROM employee;", answer.role, function (err, results) {
//                         if (err) throw err;
//                         inquirer
//                             .prompt([
//                                 {
//                                     name: "manager_name",
//                                     type: "list",
//                                     choices: function () {
//                                         let choiceArray = [];
//                                         for (var i = 0; i < results.length; i++) {
//                                             choiceArray.push(results[i].first_name);
//                                         }
//                                         return choiceArray;
//                                     },
//                                     message: "Who is the employee's manager?"
//                                 }
//                             ])
//                             .then(function (answer) {

//                                 connection.query("SELECT id FROM employee WHERE first_name = ?", answer.manager_name, function (err, results) {
//                                     if (err) throw err;
//                                     newEmployee.manager_id = results[0].id;
//                                     console.log("Adding new employee: ", newEmployee);

//                                     connection.query('INSERT INTO employee SET ?', newEmployee, function (err, results) {
//                                         if (err) throw err;
//                                         console.log("Employee successfully added.");
//                                         init()
//                                     })
//                                 })
//                             });
//                     });
//                 });
//             });
//     })
// };


// module.exports = {
//     init:init
// }; 