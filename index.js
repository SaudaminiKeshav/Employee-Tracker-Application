const mysql = require('mysql');

const employee = require('./employeeSearch.js');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "company_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});

function init() {
    console.log("\n\n\n-----------------------------\n"+
    "EMPLOYEE TRACKER APPLICATION\n"+
    "-----------------------------\n"
    );
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View Departments",
                "View Roles",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Employee",
                "Delete Employee",
                "Add Department",
                "Delete Department",
                "Add/Update Employee Role",
                "Update Manager",
                "View total utilized budget of a department",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View Departments":
                    viewDepartments();
                    break;

                case "View Roles":
                    viewRoles();
                    break;

                case "View All Employees by Department":
                    viewEmployeeDept();
                    break;

                case "View All Employees by Manager":
                    viewEmployeeMgr();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Delete Department":
                    deleteDepartment();
                    break;

                case "Delete Employee":
                    deleteEmployee();
                    break;

                case "Add/Update Employee Role":
                    updateEmployee();
                    break;

                case "Update Manager":
                    updateManager();
                    break;

                case "View total utilized budget of a department":
                    totalUtilizedBudget();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}

function viewAllEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
};

function viewDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    })
};

function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    })
};

function viewEmployeeDept() {
    // Query the database for all available departments to prompt user
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "What department would you like to search by?"
                }
            ])
            .then(function (answer) {
                console.log(answer.department);
                let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, emp.first_name AS manager FROM employee LEFT JOIN employee as emp ON emp.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id'
                connection.query(query, answer.department, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    init();
                });
            });
    });
};

function viewEmployeeMgr() {

    connection.query("SELECT DISTINCT emp.first_name, emp.last_name FROM employee LEFT JOIN employee AS emp ON employee.manager_id = emp.id WHERE emp.first_name IS NOT NULL", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "manager",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which manager would you like to search by?"
                }
            ])
            .then(function (answer) {
                console.log(answer.manager);
                let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, emp.first_name AS manager FROM employee LEFT JOIN employee AS emp ON emp.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE emp.first_name = ? ORDER BY employee.id'
                connection.query(query, answer.manager, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    init();
                });
            });
    });
};

function addEmployee() {
    let newEmployee = {};
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the employee's first name?",
                    validate: function (answer) {
                        if (answer.length == 0) {
                            return console.log("A valid first name is required.");
                        }
                        return true;
                    }
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?",
                    validate: function (answer) {
                        if (answer.length == 0) {
                            return console.log("A valid last name is required.");
                        }
                        return true;
                    }
                },
                {
                    name: "role",
                    type: "list",
                    choices: ["Assistant to the Regional Manager",
                        "Regional Manager",
                        "Accountant",
                        "HR Associate",
                        "Software Engineer",
                        "Administrative Professional",
                        "Manager",
                        "Quality Control Associate",
                        "Sales Representative"
                    ],
                    message: "What is the employee's role?"
                }
            ])
            .then(function (answer) {

                newEmployee.first_name = answer.first_name;
                newEmployee.last_name = answer.last_name;

                connection.query("SELECT * FROM role WHERE title = ?", answer.role, function (err, results) {
                    if (err) throw err;

                    newEmployee.role_id = results[0].id;

                    connection.query("SELECT * FROM employee;", answer.role, function (err, results) {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    name: "manager_name",
                                    type: "list",
                                    choices: function () {
                                        let choiceArray = [];
                                        for (var i = 0; i < results.length; i++) {
                                            choiceArray.push(results[i].first_name);
                                        }
                                        return choiceArray;
                                    },
                                    message: "Who is the employee's manager?"
                                }
                            ])
                            .then(function (answer) {

                                connection.query("SELECT id FROM employee WHERE first_name = ?", answer.manager_name, function (err, results) {
                                    if (err) throw err;
                                    newEmployee.manager_id = results[0].id;
                                    console.log("Adding new employee: ", newEmployee);

                                    connection.query('INSERT INTO employee SET ?', newEmployee, function (err, results) {
                                        if (err) throw err;
                                        console.log("Employee successfully added.\n\n\n");
                                        init();
                                    })
                                })
                            });
                    });
                });
            });
    })
};

function deleteEmployee() {
    connection.query("SELECT * FROM employee WHERE manager_id IS NOT NULL", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "removeEmployee",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to remove?"
                }
            ])
            .then(function (answer) {
                let query = 'DELETE FROM employee WHERE first_name = ?;'
                connection.query(query, answer.removeEmployee, function (err, res) {
                    if (err) throw err;
                    console.log("Employee successfully deleted \n\n\n");
                    init();
                });
            });
    });
}

function updateEmployee() {
    let newRole = {};

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "updateEmployee",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to update?"
                }
            ])
            .then(function (answer) {

                newRole.first_name = answer.updateEmployee;

                connection.query("SELECT * FROM role", function (err, res) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "updateRole",
                                type: "list",
                                choices: function () {
                                    let choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choiceArray.push(results[i].title);
                                    }
                                    return choiceArray;
                                },
                                message: "What would you like you to change their role title to?"
                            }
                        ])
                        .then(function (answer) {
                            // Translate role to role_id
                            connection.query("SELECT * FROM role WHERE title = ?", answer.updateRole, function (err, results) {
                                if (err) throw err;

                                newRole.role_id = results[0].id;

                                connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [newRole.role_id, newRole.first_name], function (err, res) {
                                    if (err) throw (err);
                                    console.log('Employee role successfully updated.\n\n\n');
                                    init();
                                })
                            })
                        });
                });
            });
    })
}

function updateManager() {
    let newManager = {};

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, emp.first_name AS manager FROM employee LEFT JOIN employee AS emp ON emp.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "updateEmployee",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to update?"
                }
            ])
            .then(function (answer) {

                newManager.first_name = answer.updateEmployee;

                connection.query("SELECT * FROM employee", function (err, res) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "updateManager",
                                type: "list",
                                choices: function () {
                                    let choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choiceArray.push(results[i].first_name);
                                    }
                                    return choiceArray;
                                },
                                message: "Who would you like to change their manager to?"
                            }
                        ])
                        .then(function (answer) {
                            connection.query("SELECT * FROM employee WHERE first_name = ?", answer.updateManager, function (err, results) {
                                if (err) throw err;

                                newManager.manager_id = results[0].id;

                                connection.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [newManager.manager_id, newManager.first_name], function (err, res) {
                                    if (err) throw (err);
                                    console.log('Employee manager successfully updated.');
                                    init();
                                })

                            })
                        });
                });
            });
    })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "dept_name",
                type: "input",
                default: "Marketing",
                message: "What is the name of the department you want to add?",
                validate: function (answer) {
                    if (answer.length == 0) {
                        return console.log("A valid department name is required.");
                    }
                    return true;
                }
            }
        ])
        .then(function (answer) {
            connection.query('INSERT INTO department (name) VALUES (?)', answer.dept_name, function (err, results) {
                if (err) throw err;
                console.log("Department successfully added.\n\n\n");
                init();
            });

        })
}

function deleteDepartment() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "removeDept",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "Which department would you like to remove?"
                }
            ])
            .then(function (answer) {
                let query = 'DELETE FROM department WHERE name = ?;'
                connection.query(query, answer.removeDept, function (err, res) {
                    if (err) throw err;
                    console.log("Department successfully deleted");
                    init();
                });
            });
    });
}

function totalUtilizedBudget(){
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "Which department's Total Utilized Budget would you like to view?"
                }
            ])
            .then(function (answer) {
                let query = 'SELECT DISTINCT role.salary, department.name AS department, emp.first_name AS manager FROM employee LEFT JOIN employee as emp ON emp.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id'
                connection.query(query, answer.department, function (err, res) {
                    if (err) throw err;
                    console.log("\n\n\nBelow are the employees in "+ answer.department+" department\n");
                    console.table(res);
                    let result = 0;
                    res.forEach(element => {
                        result += element.salary
                    });
                    console.log("\nThe total utilized budget of this department is "+ result+"\n\n");
                    init();
                });
            });
    });
}

