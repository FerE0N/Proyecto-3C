require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const databaseRoutes = require('./routes/databases');
const tableRoutes = require('./routes/tables');
const recordRoutes = require('./routes/records');

app.use('/databases', databaseRoutes);
app.use('/databases/:db/tables', tableRoutes);
app.use('/databases/:db/tables/:table/records', recordRoutes);

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.listen(port, () => {
  console.log(`programa correindo en: http://localhost:${port}`);
});
