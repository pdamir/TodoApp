--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: todoapp; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE todoapp WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE todoapp OWNER TO postgres;

\connect todoapp

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    userid integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(255) DEFAULT NULL::character varying,
    lastname character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: User_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "User_userid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "User_userid_seq" OWNER TO postgres;

--
-- Name: User_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "User_userid_seq" OWNED BY users.userid;


--
-- Name: status; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE status (
    statusid integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE status OWNER TO postgres;

--
-- Name: status_statusid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE status_statusid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE status_statusid_seq OWNER TO postgres;

--
-- Name: status_statusid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE status_statusid_seq OWNED BY status.statusid;


--
-- Name: tasklist; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE tasklist (
    tasklistid integer NOT NULL,
    taskname character varying(255) NOT NULL,
    statusid integer NOT NULL,
    sendemailnotification boolean DEFAULT false NOT NULL,
    deadline timestamp with time zone,
    userid integer
);


ALTER TABLE tasklist OWNER TO postgres;

--
-- Name: tasklist_tasklistid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tasklist_tasklistid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tasklist_tasklistid_seq OWNER TO postgres;

--
-- Name: tasklist_tasklistid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE tasklist_tasklistid_seq OWNED BY tasklist.tasklistid;


--
-- Name: statusid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY status ALTER COLUMN statusid SET DEFAULT nextval('status_statusid_seq'::regclass);


--
-- Name: tasklistid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tasklist ALTER COLUMN tasklistid SET DEFAULT nextval('tasklist_tasklistid_seq'::regclass);


--
-- Name: userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN userid SET DEFAULT nextval('"User_userid_seq"'::regclass);


--
-- Name: User_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"User_userid_seq"', 6, true);


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO status (statusid, name) VALUES (3, 'Done');
INSERT INTO status (statusid, name) VALUES (1, 'ToDo');
INSERT INTO status (statusid, name) VALUES (2, 'In Progress');


--
-- Name: status_statusid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('status_statusid_seq', 3, true);


--
-- Data for Name: tasklist; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO tasklist (tasklistid, taskname, statusid, sendemailnotification, deadline, userid) VALUES (10, 'Finish database design for UnknownApp', 3, false, NULL, 4);
INSERT INTO tasklist (tasklistid, taskname, statusid, sendemailnotification, deadline, userid) VALUES (6, 'Prepare for work presentation', 3, false, '2018-05-03 00:00:00+02', 5);
INSERT INTO tasklist (tasklistid, taskname, statusid, sendemailnotification, deadline, userid) VALUES (4, 'Request payment from client', 3, false, '2018-05-02 00:00:00+02', 5);
INSERT INTO tasklist (tasklistid, taskname, statusid, sendemailnotification, deadline, userid) VALUES (2, 'Do the laundry', 1, false, NULL, 5);
INSERT INTO tasklist (tasklistid, taskname, statusid, sendemailnotification, deadline, userid) VALUES (3, 'Clean my room', 2, false, '2018-05-01 00:00:00+02', 5);
INSERT INTO tasklist (tasklistid, taskname, statusid, sendemailnotification, deadline, userid) VALUES (5, 'Write readme file for TodoApp', 2, true, '2018-01-16 00:00:00+01', 4);
INSERT INTO tasklist (tasklistid, taskname, statusid, sendemailnotification, deadline, userid) VALUES (13, 'Buy a ticket for Chicago, USA', 1, false, '2018-01-15 00:00:00+01', 4);


--
-- Name: tasklist_tasklistid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tasklist_tasklistid_seq', 13, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO users (userid, email, password, firstname, lastname) VALUES (4, 'damir.pirke@gmail.com', 'U2FsdGVkX1/x9e13bA1yJdyIZ01sVSUsGeZ0ut3Nvv0=', 'James', 'Dean');
INSERT INTO users (userid, email, password, firstname, lastname) VALUES (5, 'pdamir@live.com', 'U2FsdGVkX1+4nWO1GJFAupCVGu6Dfnfox8XoZTf44DI=', 'John', 'Doe');


--
-- Name: User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (userid);


--
-- Name: status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY status
    ADD CONSTRAINT status_pkey PRIMARY KEY (statusid);


--
-- Name: tasklist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tasklist
    ADD CONSTRAINT tasklist_pkey PRIMARY KEY (tasklistid);


--
-- Name: status_name_uindex; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE UNIQUE INDEX status_name_uindex ON status USING btree (name);


--
-- Name: status_statusid_uindex; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE UNIQUE INDEX status_statusid_uindex ON status USING btree (statusid);


--
-- Name: tasklist_tasklistid_uindex; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE UNIQUE INDEX tasklist_tasklistid_uindex ON tasklist USING btree (tasklistid);


--
-- Name: user_email_uindex; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE UNIQUE INDEX user_email_uindex ON users USING btree (email);


--
-- Name: user_userid_uindex; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE UNIQUE INDEX user_userid_uindex ON users USING btree (userid);


--
-- Name: tasklist_status_statusid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tasklist
    ADD CONSTRAINT tasklist_status_statusid_fk FOREIGN KEY (statusid) REFERENCES status(statusid);


--
-- Name: tasklist_users_userid_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tasklist
    ADD CONSTRAINT tasklist_users_userid_fk FOREIGN KEY (userid) REFERENCES users(userid);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

