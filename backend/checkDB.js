const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
require('dotenv').config();

const checkReservations = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const reservations = await Reservation.find({});
        console.log('Total Reservations in DB:', reservations.length);
        console.log(JSON.stringify(reservations, null, 2));

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkReservations();
