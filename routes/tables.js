const express = require('express');
const router = express.Router({ mergeParams: true });
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

router.get('/', (req, res) => {
  const dbName = req.params.db;
  connection.query(`SHOW TABLES FROM ${dbName}`, (err, results) => {
    if (err) throw err;
    res.render('tables', { dbName, tables: results });
  });
});

router.get('/create', (req, res) => {
  const dbName = req.params.db;
  res.render('createTable', { dbName });
});

router.post('/create', (req, res) => {
  const dbName = req.params.db;
  const tableName = req.body.tableName.trim();
  const columnNames = req.body.columnNames;
  const columnTypes = req.body.columnTypes;
  
  if (tableName && columnNames.length > 0 && columnTypes.length > 0) {
    const columns = columnNames.map((name, index) => `${name} ${columnTypes[index]}`).join(', ');
    const query = `CREATE TABLE ${dbName}.${tableName} (${columns})`;
    connection.query(query, (err) => {
      if (err) throw err;
      res.redirect(`/databases/${dbName}/tables`);
    });
  } else {
    res.redirect(`/databases/${dbName}/tables/create`);
  }
});

router.post('/:table/delete', (req, res) => {
  const dbName = req.params.db;
  const tableName = req.params.table.trim();
  if (tableName) {
    connection.query(`DROP TABLE ${dbName}.${tableName}`, (err) => {
      if (err) throw err;
      res.redirect(`/databases/${dbName}/tables`);
    });
  } else {
    res.redirect(`/databases/${dbName}/tables`);
  }
});

module.exports = router;

