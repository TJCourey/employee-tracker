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
    // type: "list",
    // name: "roleId",
    // message: "Select role?",
    // choices() {
    // const choices = [],
    // res.forEach(({ title }) => {
    // choices.push(title)
    // })
    // return choices
    // }
    //  .then(response => {
    //  connection.query(`SELECT id FROM role WHERE title=?`, response.role, (err, data) =>{
    //  if(err){ throw err
    //  } else {
    //
    //}
    //
    //  })
    //  })
  },
  {
    type: "input",
    name: "managerId",
    message: "(Optional: enter 'null' if ) Manager ID#:",
  },
];
const removeEmployeeQ = [
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
    name: "confirm",
    message:
      "Type DELETE to verify that you want to permanently remove this employee, note this can not be undone:",
  },
];
const editRoleQ = [
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
    name: "newRole",
    message: "Please enter the new role ID#",
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
const removeRoleQ = [
  {
    type: "input",
    name: "title",
    message: "Role Name:",
  },
  {
    type: "input",
    name: "confirm",
    message:
      "Type DELETE to verify that you want to permanently remove this role, note this can not be undone:",
  },
];
const departmentQuestion = [
  {
    type: "input",
    name: "department",
    message: "Department Name:",
  },
];
const removeDepartmentQ = [
  {
    type: "input",
    name: "department",
    message: "Department Name:",
  },
  {
    type: "input",
    name: "confirm",
    message:
      "Type DELETE to verify that you want to permanently remove this department, note this can not be undone:",
  },
];
const navQuestion = [
  {
    type: "list",
    name: "nav",
    message: "Which area would you like access?",
    choices: [
      "Employees",
      "Roles",
      "Department",
      "View Main Table",
      "Quit Program",
    ],
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
viewMainTable = () => {
  connection.query(
    `SELECT first_name, last_name, title, salary, name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`,
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      initialQuestion();
    }
  );
};
viewTable = (loc) => {
  //   console.log("Selecting all employees...\n");
  connection.query(`SELECT * FROM ${loc}`, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    initialQuestion();
  });
};
addEmployee = () => {
  inquirer.prompt(employeeQuestion).then((data) => {
    console.log("Inserting a new employee...\n");
    connection.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES ("${data.firstName}", "${data.lastName}",${data.roleId} , ${data.managerId})`,
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} Employee added\n`);
        employeeActionQ();
      }
    );
  });
};
removeEmployee = () => {
  inquirer.prompt(removeEmployeeQ).then((data) => {
    switch (data.confirm) {
      case "DELETE": {
        console.log("Deleting employee...\n");
        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            last_name: data.lastName,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee deleted!\n`);
            employeeActionQ();
          }
        );
        break;
      }
      default: {
        employeeActionQ();
      }
    }
  });
};
editRole = () => {
  inquirer.prompt(editRoleQ).then((data) => {
    console.log("Updating role...\n");
    connection.query(
      "UPDATE employee SET ? WHERE ? AND ?",
      [
        {
          role_id: data.newRole,
        },
        {
          first_name: data.firstName,
        },
        {
          last_name: data.lastName,
        },
      ],
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} role updated!\n`);
        employeeActionQ();
      }
    );
  });
};
// editRole = () => {
//   inquirer
//     .prompt(
//       {
//         type: "input",
//         name: "firstName",
//         message: "First Name:",
//       },
//       {
//         type: "input",
//         name: "lastName",
//         message: "Last Name:",
//       },
//       {
//         type: "list",
//         name: "newRole",
//         message: "Please enter the new role",
//         choices: connection.query(`SELECT * FROM role`, (err, res) => {
//           if (err) throw err;
//           // Log all results of the SELECT statement
//           console.table(res);
//         }),
//       }
//     )
//     .then((data) => {
//       console.log("Updating role...\n");
//       connection.query(
//         "UPDATE employee SET ? WHERE ? AND ?",
//         [
//           {
//             role_id: data.newRole,
//           },
//           {
//             first_name: data.firstName,
//           },
//           {
//             last_name: data.lastName,
//           },
//         ],
//         (err, res) => {
//           if (err) throw err;
//           console.log(`${res.affectedRows} role updated!\n`);
//           employeeActionQ();
//         }
//       );
//     });
// };
addRole = () => {
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
        roleActionQ();
      }
    );
  });
};
removeRole = () => {
  inquirer.prompt(removeRoleQ).then((data) => {
    switch (data.confirm) {
      case "DELETE": {
        console.log("Deleting role...\n");
        connection.query(
          "DELETE FROM role WHERE ?",
          {
            title: data.title,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role deleted!\n`);
            roleActionQ();
          }
        );
      }
      default: {
        roleActionQ();
      }
    }
  });
};
addDepartment = () => {
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
        departmentActionQ();
      }
    );
  });
};
removeDepartment = () => {
  inquirer.prompt(removeDepartmentQ).then((data) => {
    switch (data.confirm) {
      case "DELETE": {
        console.log("Deleting department...\n");
        connection.query(
          "DELETE FROM department WHERE ?",
          {
            name: data.department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role deleted!\n`);
            departmentActionQ();
          }
        );
      }
      default: {
        departmentActionQ();
      }
    }
  });
};
employeeActionQ = () => {
  // console.table(viewTable("employee"));
  inquirer.prompt(empActionQuestion).then((data) => {
    switch (data.action) {
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
      case "Go Back": {
        initialQuestion();
      }
      default: {
        console.log("employee action prompt error");
      }
    }
  });
};
roleActionQ = () => {
  inquirer.prompt(actionQuestion).then((data) => {
    switch (data.action) {
      case "View": {
        viewTable("role");
        break;
      }
      case "Add": {
        addRole();
        break;
      }
      case "Remove": {
        removeRole();
        break;
      }
      case "Go Back": {
        initialQuestion();
      }
    }
  });
};
departmentActionQ = () => {
  inquirer.prompt(actionQuestion).then((data) => {
    switch (data.action) {
      case "View": {
        viewTable("department");
        break;
      }
      case "Add": {
        addDepartment();
        break;
      }
      case "Remove": {
        removeDepartment();
        break;
      }
      case "Go Back": {
        initialQuestion();
      }
    }
  });
};
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
        break;
      }
      case "View Main Table": {
        viewMainTable();
        break;
      }
      case "Quit Program": {
        console.log("Goodbye");
        connection.end();
      }
    }
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  viewMainTable();
});
