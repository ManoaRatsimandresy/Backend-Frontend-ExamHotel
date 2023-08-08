const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const path = require('path');
const db = require('../db/db.js');

router.get('/client.ejs', (req, res) => {
     res.render('client', { availableRooms: null }); // Afficher le formulaire vide au début
 });
 
 router.post('/room_dispo', async (req, res) => {
     try {
         const startDate = req.body.startDate;
         const endDate = req.body.endDate;
         const city = req.body.city;
 
         // Récupérer les chambres disponibles dans la ville spécifiée pour les dates spécifiées
         const availableRooms = await db.any(`
             SELECT r.id, r.id_hotel, rt.name AS room_type, rt.base_price
             FROM room r
             INNER JOIN room_type rt ON r.id_room_type = rt.id
             INNER JOIN hotel h ON r.id_hotel = h.id
             INNER JOIN city c ON h.id_city = c.id_city
             WHERE r.id NOT IN (
                 SELECT id_room
                 FROM room_reservation
                 WHERE start_date <= $1 AND end_date >= $2
             )
             AND c.name = $3
         `, [startDate, endDate, city]);
 
         res.render('client', { availableRooms }); // Afficher le formulaire avec la liste des chambres disponibles
     } catch (error) {
         console.error('Erreur lors de la récupération des chambres disponibles :', error);
         res.status(500).send('Erreur lors de la récupération des chambres disponibles');
     }
 });
 
 module.exports = router;