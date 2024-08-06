const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

router.get('/', (req, res) => {
  connection.query('SHOW DATABASES', (err, results) => {
    if (err) throw err;
    res.render('databases', { databases: results });
  });
});

router.post('/create', (req, res) => {
  const dbName = req.body.dbName.trim();
  if (dbName) {
    connection.query(`CREATE DATABASE ${dbName}`, (err) => {
      if (err) throw err;
      res.redirect('/databases');
    });
  } else {
    res.redirect('/databases');
  }
});

router.post('/delete', (req, res) => {
  const dbName = req.body.dbName.trim();
  if (dbName) {
    connection.query(`DROP DATABASE ${dbName}`, (err) => {
      if (err) throw err;
      res.redirect('/databases');
    });
  } else {
    res.redirect('/databases');
  }
});

module.exports = router;
