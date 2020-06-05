const inquirer = require("inquirer");
const connection = require("./db/connection");
const cTable = require("console.table");

const questionOne = function () {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    })
    .then((answer) => {
      switch (answer) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Employees by Department":
          viewByDepartment();
          break;
        case "View All Employees by Manager":
          viewByManager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Employee Manager":
          updateManager();
          break;
      }
    });
};

function viewAllEmployees() {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    cTable(res);
  });
}
