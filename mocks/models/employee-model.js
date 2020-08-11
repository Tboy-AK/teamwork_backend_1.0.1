/* eslint-disable no-underscore-dangle */
const db = require('../db.json');

const EmployeeModel = {
  findByEmail: (userEmail) => {
    const usersWithEmail = db.employees.find(({ email }) => email === userEmail);
    if (usersWithEmail) return usersWithEmail;
    throw new Error('Data does not exist');
  },
  createEmployee: (userData) => {
    if (db.auths.find(({ email }) => email === userData.email)) throw new Error('Unique data already exist');

    const newAuth = { email: userData.email, password: userData.password };
    newAuth._id = db.auths.length + 1;
    db.auths.push(newAuth);

    const newUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      address: userData.address,
    };
    newUser._id = db.users.length + 1;
    db.users.push(newUser);

    const newEmployee = {
      userId: newUser._id,
      jobRole: userData.jobRole,
      department: userData.department,
    };
    newEmployee._id = db.employees.length + 1;
    db.employees.push(newEmployee);

    return db.employees[db.employees.length - 1];
  },
  makeEmployee: (userData) => {
    const user = db.users.find(({ email }) => email === userData.email);
    if (!user) throw new Error('Inexistent relationship');

    const asEmployee = {
      userId: user._id,
      jobRole: userData.jobRole,
      department: userData.department,
    };
    asEmployee._id = db.employees.length + 1;
    db.employees.push(asEmployee);

    return db.employees[db.employees.length - 1];
  },
};

module.exports = EmployeeModel;
