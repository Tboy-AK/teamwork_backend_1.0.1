-- CREATE SEQUENCES

CREATE SEQUENCE IF NOT EXISTS genders_id_seq;
CREATE SEQUENCE IF NOT EXISTS auths_id_seq;
CREATE SEQUENCE IF NOT EXISTS job_roles_id_seq;
CREATE SEQUENCE IF NOT EXISTS departments_id_seq;
CREATE SEQUENCE IF NOT EXISTS employees_id_seq;


-- CREATE FUNCTIONS

CREATE FUNCTION PUBLIC.timestamp_on_create()
  RETURNS TRIGGER
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE NOT LEAKPROOF
AS $BODY$ BEGIN
  NEW.created_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END; $BODY$;

COMMENT ON FUNCTION PUBLIC.timestamp_on_create()
  IS 'Time stamp to track the date and time the data on a row was created';

CREATE FUNCTION PUBLIC.timestamp_on_modify()
  RETURNS TRIGGER
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE NOT LEAKPROOF
AS $BODY$ BEGIN
  NEW.modified_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END; $BODY$;

COMMENT ON FUNCTION PUBLIC.timestamp_on_modify()
  IS 'Time stamp to track the date and time the data on a row was modified';


CREATE FUNCTION row_version_on_modify()
  RETURNS TRIGGER
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE NOT LEAKPROOF
AS $BODY$ BEGIN
  NEW._v := NEW._v + 1;
  RETURN NEW;
END; $BODY$;

COMMENT ON FUNCTION row_version_on_modify()
  IS 'Version recorder to monitor changes made on a row of data';


-- DROP ALL TABLES

DROP TABLE IF EXISTS genders CASCADE;
DROP TABLE IF EXISTS auths CASCADE;
DROP TABLE IF EXISTS job_roles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS employees CASCADE;


-- CREATE TABLES AND TRIGGERS
  
CREATE TABLE IF NOT EXISTS genders (
  _id INTEGER GENERATED ALWAYS AS IDENTITY,
  name CHARACTER VARYING (10) COLLATE pg_catalog."default" NOT NULL,
  abbr CHARACTER VARYING (2) COLLATE pg_catalog."default" NOT NULL,
  _desc TEXT COLLATE pg_catalog."default",
  _v INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT genders_pkey PRIMARY KEY (_id),
  CONSTRAINT genders_name_key UNIQUE (name)
);

COMMENT ON TABLE PUBLIC.genders
  IS 'Table where the gender type of app users are referenced from';

CREATE TRIGGER genders_timestamp_on_create
  BEFORE INSERT
  ON PUBLIC.genders
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_create();

CREATE TRIGGER genders_timestamp_on_modify
  BEFORE INSERT OR UPDATE
  ON PUBLIC.genders
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_modify();

CREATE TRIGGER genders_row_version_on_modify
  BEFORE UPDATE
  ON PUBLIC.genders
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.row_version_on_modify();


CREATE TABLE IF NOT EXISTS auths (
  _id INTEGER GENERATED ALWAYS AS IDENTITY,
  email CHARACTER VARYING (100) COLLATE pg_catalog."default" NOT NULL,
  password CHARACTER VARYING (1024) COLLATE pg_catalog."default" NOT NULL,
  first_name CHARACTER VARYING (30) COLLATE pg_catalog."default" NOT NULL,
  last_name CHARACTER VARYING (30) COLLATE pg_catalog."default" NOT NULL,
  gender_id INTEGER NOT NULL,
  address CHARACTER VARYING (100) COLLATE pg_catalog."default" NOT NULL,
  _v INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT auths_pkey PRIMARY KEY (_id),
  CONSTRAINT auths_email_key UNIQUE (email),
  CONSTRAINT employees_gender_id_fkey FOREIGN KEY (gender_id)
    REFERENCES PUBLIC.genders (_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

COMMENT ON TABLE PUBLIC.auths
  IS 'Table where registered app users are recorded';

CREATE TRIGGER auths_timestamp_on_create
  BEFORE INSERT
  ON PUBLIC.auths
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_create();

CREATE TRIGGER auths_timestamp_on_modify
  BEFORE INSERT OR UPDATE
  ON PUBLIC.auths
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_modify();

CREATE TRIGGER auths_row_version_on_modify
  BEFORE UPDATE
  ON PUBLIC.auths
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.row_version_on_modify();


CREATE TABLE IF NOT EXISTS job_roles (
  _id INTEGER GENERATED ALWAYS AS IDENTITY,
  name CHARACTER VARYING (100) COLLATE pg_catalog."default" NOT NULL,
  abbr CHARACTER VARYING (30) COLLATE pg_catalog."default",
  _desc TEXT COLLATE pg_catalog."default",
  _v INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT job_roles_pkey PRIMARY KEY (_id),
  CONSTRAINT job_roles_name_key UNIQUE (name)
);

COMMENT ON TABLE PUBLIC.job_roles
  IS 'Table where the job roles for employees are referenced from';

CREATE TRIGGER job_roles_timestamp_on_create
  BEFORE INSERT
  ON PUBLIC.job_roles
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_create();

CREATE TRIGGER job_roles_timestamp_on_modify
  BEFORE INSERT OR UPDATE
  ON PUBLIC.job_roles
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_modify();

CREATE TRIGGER job_roles_row_version_on_modify
  BEFORE UPDATE
  ON PUBLIC.job_roles
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.row_version_on_modify();


CREATE TABLE IF NOT EXISTS departments (
  _id INTEGER GENERATED ALWAYS AS IDENTITY,
  name CHARACTER VARYING (100) COLLATE pg_catalog."default" NOT NULL,
  abbr CHARACTER VARYING (30) COLLATE pg_catalog."default",
  _desc TEXT COLLATE pg_catalog."default",
  _v INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT departments_pkey PRIMARY KEY (_id),
  CONSTRAINT departments_name_key UNIQUE (name)
);

COMMENT ON TABLE PUBLIC.departments
  IS 'Table where the departments for employees are referenced from';

CREATE TRIGGER departments_timestamp_on_create
  BEFORE INSERT
  ON PUBLIC.departments
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_create();

CREATE TRIGGER departments_timestamp_on_modify
  BEFORE INSERT OR UPDATE
  ON PUBLIC.departments
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_modify();

CREATE TRIGGER departments_row_version_on_modify
  BEFORE UPDATE
  ON PUBLIC.departments
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.row_version_on_modify();


CREATE TABLE IF NOT EXISTS employees (
  _id INTEGER GENERATED ALWAYS AS IDENTITY,
  auth_id INTEGER NOT NULL,
  job_role_id INTEGER NOT NULL,
  department_id INTEGER NOT NULL,
  _v INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT employees_pkey PRIMARY KEY (_id),
  CONSTRAINT employees_auth_id_key UNIQUE (auth_id),
  CONSTRAINT employees_auth_id_fkey FOREIGN KEY (auth_id)
    REFERENCES PUBLIC.auths (_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT employees_job_role_id_fkey FOREIGN KEY (job_role_id)
    REFERENCES PUBLIC.job_roles (_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id)
    REFERENCES PUBLIC.departments (_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

COMMENT ON TABLE PUBLIC.employees
  IS 'Table where employees are recorded. Employees are registered app users';

CREATE TRIGGER employees_timestamp_on_create
  BEFORE INSERT
  ON PUBLIC.employees
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_create();

CREATE TRIGGER employees_timestamp_on_modify
  BEFORE INSERT OR UPDATE
  ON PUBLIC.employees
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.timestamp_on_modify();

CREATE TRIGGER employees_row_version_on_modify
  BEFORE UPDATE
  ON PUBLIC.employees
  FOR EACH ROW
  EXECUTE PROCEDURE PUBLIC.row_version_on_modify();


-- INSERT INTO TABLES

INSERT INTO genders (name, abbr, _desc)
  VALUES ('male', 'm', 'The masculine gender'),
  ('female', 'f', 'The feminine gender');

INSERT INTO job_roles (name, abbr)
  VALUES ('Chief Executive Officer', 'CEO'),
  ('Chief Financial Officer', 'CFO'),
  ('Human Resource Manager', 'HRM'),
  ('Chief Technical Officer', 'CTO'),
  ('Software Engineer', NULL);

INSERT INTO departments (name, abbr)
  VALUES ('Board of Directors', NULL),
  ('Human Resource', 'HR'),
  ('Finance', NULL),
  ('Information Technology', 'IT');
