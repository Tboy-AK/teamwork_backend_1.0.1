/* eslint-disable no-underscore-dangle */
const db = require('../db.json');

const EmployeeModel = {
  findByEmail: (userEmail) => {
    const usersWithEmail = db.employees.find(({ email }) => email === userEmail);
    if (usersWithEmail) return usersWithEmail;
    throw new Error('Data does not exist');
  },
  createEmployee: (...args) => {
    const userData = {
      firstName: args[2],
      password: args[1],
      lastName: args[3],
      gender: args[4],
      address: args[5],
      email: args[0],
      jobRole: args[6],
      department: args[7],
    };

    if (db.auths.find(({ email }) => email === userData.email)) {
      const newErr = new Error('Unique data already exist');
      newErr.code = '23505';
      throw newErr;
    }

    const newUser = {
      _id: db.auths.length + 1,
      firstName: userData.firstName,
      password: userData.password,
      lastName: userData.lastName,
      gender: userData.gender,
      address: userData.address,
    };
    db.auths.push(newUser);

    const newEmployee = {
      _id: db.employees.length + 1,
      userId: newUser._id,
      jobRole: userData.jobRole,
      department: userData.department,
    };
    db.employees.push(newEmployee);

    return db.employees[db.employees.length - 1];
  },
  makeEmployee: (userData) => {
    const user = db.auths.find(({ email }) => email === userData.email);
    if (!user) throw new Error('Non-existent relationship');

    const asEmployee = {
      _id: db.employees.length + 1,
      userId: user._id,
      jobRole: userData.jobRole,
      department: userData.department,
    };
    db.employees.push(asEmployee);

    return db.employees[db.employees.length - 1];
  },
};

module.exports = EmployeeModel;
