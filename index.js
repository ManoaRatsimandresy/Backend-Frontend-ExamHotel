
const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const path = require('path');
const bodyParser = require('body-parser');

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'hotel',
    user: 'postgres',
    password: '123KyrieIrving'
};
const db = pgp(dbConfig);


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route pour afficher la page de connexion
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/', async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    try {
        // Vérifier si l'utilisateur existe et a un rôle d'administrateur (id_role = 1)
        const user = await db.oneOrNone('SELECT * FROM "user" WHERE email = $1 AND username = $2 AND password = $3 AND id_role = 1', [email, username, password]);

        if (user) {
            // L'utilisateur existe et a un rôle d'administrateur (id_role = 1)
            res.redirect('/index.ejs');
        } else {
            // L'utilisateur n'existe pas ou n'a pas le rôle d'administrateur (id_role = 1)
            res.send('Identifiants invalides pour un administrateur. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des informations d\'identification:', error);
        res.status(500).send('Erreur lors de la vérification des informations d\'identification');
    }
});

app.get('/client.ejs', (req, res) => {
    res.render('client');
});


app.get('/index.ejs', async (req, res) => {
    try {
        // Récupérer tous les utilisateurs de la table "utilisateurs"
        const users = await db.any('SELECT * FROM "user"');

        // Rendre le fichier EJS et transmettre les données des utilisateurs
        res.render('index', { users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
});


// =========================================ADD BOOKING INSERT

app.get('/all-booking.ejs', async (req, res) => {
    try {
        // Récupérer les utilisateurs de la table "user"
        const reservations = await db.any('SELECT res.start_timestamp, res.end_timestamp, u.first_name , u.last_name , u.email, room_type.name FROM reservation res INNER JOIN "user" u ON res.user_id = u.user_id INNER JOIN "room" ON res.room_id = room.id INNER JOIN "room_type" ON room_type.id = room.id_room_type');
        reservations.forEach((reservation) => {
            reservation.start_timestamp = formatDate(reservation.start_timestamp);
            reservation.end_timestamp = formatDate(reservation.end_timestamp);
        });
        // Rendre le fichier EJS et transmettre les données des utilisateurs
        res.render('all-booking', { reservations });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
});
function formatDate(timestamp) {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
 // ===========================================================================================================================================


 app.post('/client.ejs', async (req, res) => { // Remplacez '/inserer-donnees' par la route correcte vers laquelle le formulaire est envoyé
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const date_of_entry = req.body.date_of_entry;
    const release_date = req.body.release_date;
    const email = req.body.email;
    const id_room_type = req.body.room_type;
    const username = req.body.username;
    try {
      // Requête SQL pour l'insertion des données
     
        await db.none('INSERT INTO "user" (first_name, last_name, email, username) VALUES ($1, $2, $3, $4)', [first_name, last_name,  email, username]);
        await db.none('INSERT INTO reservation (date_of_entry, release_date, id_room_type) VALUES ($1, $2, $3)', [date_of_entry, release_date, id_room_type])
      res.status(201).send('Données insérées avec succès.');

    } catch (err) {
      console.error('Erreur lors de l\'insertion des données :', err);
      res.status(500).send('Erreur serveur');
    }
  });
  

app.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur http://localhost:3000');
});
