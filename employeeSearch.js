const inquirer = require('inquirer');

function viewAllEmployees(connection, cb) {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        cb();
    });
};

function viewEmployeeDept(connection, cb) {
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
                let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id'
                connection.query(query, answer.department, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    cb();
                });
            });
    });
};

module.exports = {
    viewAllEmployees: viewAllEmployees,
    viewAllEmployees: viewAllEmployees,
    viewEmployeeDept: viewEmployeeDept
}; 