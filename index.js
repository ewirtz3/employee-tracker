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
      switch (answer.choice) {
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
        case "Exit":
          connection.end();
          break;
      }
    });
};

questionOne();

function viewAllEmployees() {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    console.table(res);
    questionOne();
  });
}

function viewByDepartment() {
  inquirer
    .prompt({
      name: "departmentId",
      type: "list",
      message: "Which department would you like to view?",
      choices: [
        {
          name: "Sales",
          value: 1,
        },
        { name: "Engineering", value: 2 },
        { name: "Finance", value: 3 },
        { name: "Legal", value: 4 },
      ],
    })
    .then((answer) => {
      console.log(answer.departmentId);
      const department_id = answer.departmentId;

      let query =
        "SELECT employee.id, employee.first_name, employee.last_name FROM employee ";
      query += "LEFT JOIN role ON employee.id = role.id ";
      query +=
        "LEFT JOIN department ON role.department_id = department.id WHERE department.id = ?;";
      console.log(query);

      connection.query(query, department_id, (err, res) => {
        console.table(res);
        questionOne();
      });
    });
}

function viewByManager() {
  inquirer.prompt({
    name: "manager",
    type: "list",
    message: "Which manager's team would you like to view?",
    choices: [],
  });
}

function addEmployee() {}

function removeEmployee() {}

function updateRole() {}

function updateManager() {}
