const pool = require('../configs/db-config');

const EmployeeModel = class {
  /**
   * @description Register a new employee
   * @typedef args Employee details
   * @type {Array}
   * @param {String} email Employee's email
   * @param {String} password Employee's hashed password
   * @param {String} first_name Employee's first name
   * @param {String} last_name Employee's first name
   * @param {String} gender Employee's gender
   * @param {String} address Employee's residential address
   * @param {String} job_role Employee's job role
   * @param {String} department Employee's department
   */
  static async createEmployee(...args) {
    const queryString = `WITH new_auth AS (
      INSERT INTO auths (email, password, first_name, last_name, gender_id, address)
      SELECT $1, $2, $3, $4, genders._id, $6 FROM genders WHERE genders.name=$5
      RETURNING auths.*
    ), new_employee AS (
      INSERT INTO employees (auth_id, job_role_id, department_id)
      SELECT new_auth._id, job_roles._id, departments._id FROM new_auth, job_roles, departments
      WHERE job_roles.name=$7 AND departments.name=$8
      RETURNING employees.*
    ) SELECT new_auth._id, new_auth.email, new_auth.first_name, new_auth.last_name, new_auth.address,
    genders.name AS gender, job_roles.name AS job_role, departments.name AS department FROM new_auth
    INNER JOIN genders ON genders._id=new_auth.gender_id
    INNER JOIN new_employee ON new_auth._id=new_employee.auth_id
    LEFT JOIN job_roles ON new_employee.job_role_id=job_roles._id
    LEFT JOIN departments ON new_employee.department_id=departments._id;`;
    try {
      const user = await pool.query(queryString, args);
      return Promise.resolve(user.rows[0]);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = EmployeeModel;
