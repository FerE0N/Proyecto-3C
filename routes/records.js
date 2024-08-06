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
  const tableName = req.params.table;
  connection.query(`SELECT * FROM ${dbName}.${tableName}`, (err, results) => {
    if (err) throw err;
    res.render('records', { dbName, tableName, records: results });
  });
});

router.get('/insert', (req, res) => {
  const dbName = req.params.db;
  const tableName = req.params.table;
  res.render('insertRecord', { dbName, tableName });
});

router.post('/insert', (req, res) => {
  const dbName = req.params.db;
  const tableName = req.params.table;
  const values = req.body.values;

  if (values && values.length > 0) {
    const formattedValues = values.map(value => `'${value}'`).join(', ');
    const query = `INSERT INTO ${dbName}.${tableName} VALUES (${formattedValues})`;
    connection.query(query, (err) => {
      if (err) throw err;
      res.redirect(`/databases/${dbName}/tables/${tableName}/records`);
    });
  } else {
    res.redirect(`/databases/${dbName}/tables/${tableName}/records/insert`);
  }
});

router.post('/delete', (req, res) => {
  const dbName = req.params.db;
  const tableName = req.params.table;
  const id = req.body.id.trim();
  const columnName = req.body.columnName.trim();
  if (id && columnName) {
    connection.query(`DELETE FROM ${dbName}.${tableName} WHERE ${columnName} = ?`, [id], (err) => {
      if (err) throw err;
      res.redirect(`/databases/${dbName}/tables/${tableName}/records`);
    });
  } else {
    res.redirect(`/databases/${dbName}/tables/${tableName}/records`);
  }
});

router.post('/update', (req, res) => {
  const dbName = req.params.db;
  const tableName = req.params.table;
  const id = req.body.id.trim();
  const columnName = req.body.columnName.trim();
  const updates = req.body.updates.trim();
  if (id && columnName && updates) {
    connection.query(`UPDATE ${dbName}.${tableName} SET ${updates} WHERE ${columnName} = ?`, [id], (err) => {
      if (err) throw err;
      res.redirect(`/databases/${dbName}/tables/${tableName}/records`);
    });
  } else {
    res.redirect(`/databases/${dbName}/tables/${tableName}/records`);
  }
});

module.exports = router;
