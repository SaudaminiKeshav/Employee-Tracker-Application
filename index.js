const mysql = require('mysql');
const inquirer = require('inquirer');

const employee = require('./employeeSearch.js');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "company_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  init();
});

function init() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Employee",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    employee.viewAllEmployees(connection, init);
                    break;

                case "View All Employees by Department":
                    employee.viewEmployeeDept(connection, init);
                    break;

                case "View All Employees by Manager":
                    employee.viewEmployeeMgr(connection, init);
                        break;

                case "Add Employee":
                    employee.addEmployee(connection, init);
                        break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}