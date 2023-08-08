const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const path = require('path');
const db = require('../db/db.js');

router.post('/signup', async (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const birthdate = req.body.birthdate;
    const cin = req.body.cin;
    const number = req.body.number;
    const genre = req.body.genre;

    try {
        await db.none('INSERT INTO "user" (first_name, last_name, username, email, password, birthdate, cin, number, gender, id_role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 3)',
            [first_name, last_name, username, email, password, birthdate, Number(cin), number, genre]);
        res.redirect('/client.ejs');
    } catch (err) {
        console.error('Erreur lors de l\'insertion des données :', err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
