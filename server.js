const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const path = require('path');
const bodyParser = require('body-parser');

const signUpRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const clientRoute = require('./routes/client');
const indexRoute = require('./routes/index');
const db = require('./db/db.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', signUpRoute);
app.use('/', loginRoute);
app.use('/', clientRoute);
app.use('/', indexRoute);

app.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur http://localhost:3000');
});
