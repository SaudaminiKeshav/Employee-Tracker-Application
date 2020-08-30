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
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees(connection, start);
                    break;

                case "View All Employees by Department":
                    viewEmployeeDept(connection, start);
                    break;

                case "View All Employees by Manager":
                        break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}