const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const path = require('path');
const db = require('../db/db.js');

router.get('/index.ejs', async (req, res) => {
    try {
        const users = await db.any('SELECT * FROM "user"');
        res.render('index', { users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
});

router.get('/all-employee.ejs', async (req, res) => {

     try {
         // Récupérer les utilisateurs de la table "user"
         const employees = await db.any('select first_name, last_name, society_name, number, email, r.name from "user" INNER JOIN role r ON "user".id_role = r.id_role where "user".id_role = 4 OR "user".id_role = 2');
 
         res.render('all-employee', { employees });
         // Rendre le fichier EJS et transmettre les données des utilisateurs
     } catch (error) {
         console.error('Erreur lors de la récupération des utilisateurs:', error);
         res.status(500).send('Erreur lors de la récupération des utilisateurs');
     }
 });

router.get('/all-booking.ejs', async (req, res) => {
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
router.get('/all-room.ejs', (req, res) =>{
     res.render('all-room')
})

module.exports = router;
