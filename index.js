
const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const path = require('path');

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'hotel',
    user: 'postgres',
    password: 'tsilavina'
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

// Route pour traiter la soumission du formulaire de connexion
app.post('/', async (req, res) => {
    const email = req.body.email;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    try {
        // Vérifier si l'utilisateur existe et correspond à un client, un réceptionniste ou un administrateur
        // Vous devez adapter la requête SQL en fonction de votre base de données et de votre schéma
        const user = await db.oneOrNone('SELECT * FROM "user" WHERE email = $1 AND first_name = $2 AND last_name = $3', [email, firstName, lastName]);
        
        if (user) {
            // L'utilisateur existe et correspond à un client, un réceptionniste ou un administrateur

            // Vérifier le rôle de l'utilisateur dans la table "role"
            const userRole = await db.oneOrNone('SELECT name FROM "role" WHERE user_id = $1', [user.user_id]);

            if (userRole) {
                // Si l'utilisateur est un administrateur, redirigez-le vers la page index.ejs
                if (userRole.name === 'administrateur') {
                    res.redirect('/index');
                } else {
                    // Sinon, redirigez-le vers la page all-employee.ejs
                    res.redirect('/all-employee');
                }
            } else {
                // Si le rôle de l'utilisateur n'est pas défini, affichez un message d'erreur
                res.send('Le rôle de l\'utilisateur n\'est pas défini.');
            }
        } else {
            // L'utilisateur n'existe pas ou les informations d'identification sont incorrectes
            res.send('Identifiants invalides. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des informations d\'identification:', error);
        res.status(500).send('Erreur lors de la vérification des informations d\'identification');
    }
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

app.get('/all-booking.ejs', async (req, res) => {
    try {
        // Récupérer tous les utilisateurs de la table "utilisateurs"
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

app.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur http://localhost:3000');
});
