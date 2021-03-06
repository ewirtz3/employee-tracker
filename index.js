const inquirer = require("inquirer");
const connection = require("./db/connection");
// const Team = require("./db/queries");

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
        "Exit",
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

async function viewByDepartment() {
  await inquirer
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
      const department_id = answer.departmentId;

      let query =
        "SELECT employee.id, employee.first_name, employee.last_name FROM employee ";
      query += "LEFT JOIN role ON employee.id = role.id ";
      query +=
        "LEFT JOIN department ON role.department_id = department.id WHERE department.id = ?;";

      connection.query(query, department_id, (err, res) => {
        console.table(res);
        questionOne();
      });
    });
}

function viewByManager() {
  connection.query(
    "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as name FROM employee WHERE manager_id IS NULL",
    async (err, res) => {
      if (err) throw err;
      const manager_choices = res.map((manager) => ({
        name: manager.name,
        value: manager.id,
      }));

      const { manager_id } = await inquirer.prompt({
        name: "manager_id",
        type: "list",
        message: "Which manager's team would you like to view?",
        choices: manager_choices,
      });

      connection.query(
        "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as name FROM employee WHERE manager_id = ?",
        [manager_id],
        (err, res) => {
          if (err) throw err;
          console.table(res);
        }
      );
    }
  );
}

async function addEmployee() {
  connection.query(
    "SELECT DISTINCT role.title, role.id FROM role",
    async (err, res) => {
      if (err) throw err;
      const roleChoices = res.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
      const employee = await inquirer.prompt([
        {
          name: "first_name",
          message: "What is the employee's first name?",
        },
        {
          name: "last_name",
          message: "What is the employee's last name?",
        },
      ]);

      const { roleId } = await inquirer.prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      });

      employee.role_id = roleId;

      const managers = await connection.query(
        "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as name FROM employee WHERE manager_id IS NULL",
        async (err, res) => {
          if (err) throw err;
          const manager_choices = res.map((manager) => ({
            name: manager.name,
            value: manager.id,
          }));
          const { manager_id } = await inquirer.prompt({
            name: "manager_id",
            type: "list",
            message: "Who is the employee's manager?",
            choices: manager_choices,
          });

          employee.manager_id = manager_id;
        }
      );

      const newEmployee = await connection.query("INSERT INTO employee SET ?", [
        employee,
      ]);

      res.json(newEmployee);

      questionOne();
    }
  );
}
