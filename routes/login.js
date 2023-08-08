const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const path = require('path');
const db = require('../db/db.js');

router.get('/', (req, res) => {
     res.render('login');
 });
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await db.oneOrNone('SELECT * FROM "user" WHERE email = $1 AND username = $2 AND password = $3 AND id_role = 1', [email, username, password]);
        const client = await db.oneOrNone('SELECT * FROM "user" WHERE email = $1 AND username = $2 AND password = $3 AND id_role = 3', [email, username, password]);

        if (user) {
            res.redirect('/index.ejs');
        } else if (client) {
            res.redirect('/client.ejs');
        } else {
            res.send('Identifiants invalides pour un administrateur. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des informations d\'identification :', error);
        res.status(500).send('Erreur lors de la vérification des informations d\'identification');
    }
});

module.exports = router;
