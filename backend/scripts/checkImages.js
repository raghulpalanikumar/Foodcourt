const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const products = await Product.find().limit(5);
        console.log('--- First 5 Products ---');
        products.forEach(p => {
            console.log(`Name: ${p.name}`);
            console.log(`Image: ${p.image}`);
            console.log('---');
        });

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkImages();
