const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db",
});

const employeeQuestion = [
  {
    type: "input",
    name: "firstName",
    message: "First Name:",
  },
  {
    type: "input",
    name: "lastName",
    message: "Last Name:",
  },
  {
    type: "input",
    name: "roleId",
    message: "Role ID#:",
  },
  {
    type: "input",
    name: "managerId",
    message: "(Optional) Manager ID#:",
  },
];
const roleQuestion = [
  {
    type: "input",
    name: "title",
    message: "Title:",
  },
  {
    type: "input",
    name: "salary",
    message: "(up to two decimal places) Salary:",
  },
  {
    type: "input",
    name: "departmentId",
    message: "Department ID#:",
  },
];
const departmentQuestion = [
  {
    type: "input",
    name: "department",
    message: "Department Name:",
  },
];
const navQuestion = [
  {
    type: "list",
    name: "nav",
    message: "Which area would you like access?",
    choices: ["Employees", "Roles", "Department", "Quit Program"],
  },
];
const empActionQuestion = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View", "Add", "Remove", "Edit Role", "Go Back"],
  },
];
const actionQuestion = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View", "Add", "Remove", "Go Back"],
  },
];
const viewTable = (loc) => {
  //   console.log("Selecting all employees...\n");
  connection.query(`SELECT * FROM ${loc}`, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
  });
};

const addEmployee = () => {
  inquirer.prompt(employeeQuestion).then((data) => {
    console.log("Inserting a new employee...\n");
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: data.firstName,
        lastName: data.lastName,
        role_id: data.roleId,
        manager_id: data.managerId,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} Employee added\n`);
      }
    );
  });
};
const addRole = () => {
  inquirer.prompt(roleQuestion).then((data) => {
    console.log("Inserting a new role...\n");
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: data.title,
        salary: data.salary,
        department_id: data.departmentId,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} Role added\n`);
      }
    );
  });
};
const addDepartment = () => {
  inquirer.prompt(departmentQuestion).then((data) => {
    console.log("Inserting a new department...\n");
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: data.department,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} Department added\n`);
      }
    );
  });
};
const removeEmployee = (data) => {};

initialQuestion = () => {
  inquirer.prompt(navQuestion).then((data) => {
    switch (data.nav) {
      case "Employees": {
        employeeActionQ();
        break;
      }
      case "Roles": {
        roleActionQ();
        break;
      }
      case "Department": {
        departmentActionQ();
      }
      case "Quit Program": {
        console.log("Goodbye");
        connection.end();
      }
    }
  });
};

employeeActionQ = () => {
  console.table(employeeView());
  inquirer.prompt(empActionQuestion).then((data) => {
    switch (data.nav) {
      case "View": {
        viewTable("employee");
        break;
      }
      case "Add": {
        addEmployee();
        break;
      }
      case "Remove": {
        removeEmployee();
        break;
      }
      case "Edit Role": {
        editRole();
        break;
      }
      case "Go back": {
        initialQuestion();
      }
    }
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  viewTable("");
});
