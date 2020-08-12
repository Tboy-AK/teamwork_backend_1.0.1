const pool = require('../configs/db-config');

const AuthsModel = class {
  /**
   * @description Get a user by email and/or other parameters
   * @param {String} email User's email
   * @param {Object} options Additional SELECT parameters
   * @param {String} options.first_name User's first name
   * @param {String} options.last_name User's first name
   * @param {String} options.address User's residential address
   */
  static async getOneByEmail(email, options = {}) {
    const querySelectConditions = () => {
      let text = '';
      const optionalFields = Object.keys(options);

      if (optionalFields.length > 0) {
        optionalFields.forEach((k) => {
          text += ` AND ${k}='${options[k]}'`;
        });
      }

      return text;
    };

    const queryString = `SELECT auths._id, auths.email, auths.first_name, auths.last_name, auths.address, auths.password,
    genders.name AS gender, job_roles.name AS job_role, departments.name AS department
    FROM auths
    INNER JOIN genders ON auths.gender_id=genders._id
    INNER JOIN employees ON employees.auth_id=auths._id
    LEFT JOIN job_roles ON employees.job_role_id=job_roles._id
    LEFT JOIN departments ON employees.department_id=departments._id
    WHERE email='${email}'${options != null && querySelectConditions()};`;

    try {
      const user = await pool.query(queryString);
      if (user.rowCount > 1) {
        const newErr = new Error('Search result is beyond the count scope. COUNTSCOPE=1');
        newErr.code = 'ECOUNT';
        throw newErr;
      }
      if (user.rowCount === 0) {
        const newErr = new Error('Resource not found');
        newErr.code = 'ENULL';
        throw newErr;
      }
      return Promise.resolve(user.rows[0]);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = AuthsModel;
