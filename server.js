const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db",
});

employeeQuestion = [
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
roleQuestion = [
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
departmentQuestion = [
  {
    type: "input",
    name: "department",
    message: "Department Name:",
  },
];

const employeeView = () => {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    connection.end();
  });
};
