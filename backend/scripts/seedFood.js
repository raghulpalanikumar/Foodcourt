const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const foods = [
    // Breakfast
    {
        name: 'Ghee Roast Dosa',
        description: 'Crispy, golden-brown dosa made with pure cow ghee, served with 3 types of chutneys and sambar.',
        price: 65,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee597a?q=80&w=600&auto=format&fit=crop',
        category: 'breakfast',
        isVeg: true,
        stock: 100,
        rating: 4.8
    },
    {
        name: 'Idli Sambar (2 Pcs)',
        description: 'Soft steamed rice cakes served with flavorful lentil soup (sambar) and coconut chutney.',
        price: 45,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
        category: 'breakfast',
        isVeg: true,
        stock: 120,
        rating: 4.5
    },
    {
        name: 'Ven Pongal',
        description: 'Creamy rice and moong dal porridge tempered with cashew, black pepper, and ghee.',
        price: 55,
        image: 'https://images.unsplash.com/photo-1626132646529-50063753238a?q=80&w=600&auto=format&fit=crop',
        category: 'breakfast',
        isVeg: true,
        stock: 80,
        rating: 4.6
    },

    // Lunch
    {
        name: 'Chicken Biryani (Basmati)',
        description: 'Authentic Seeraga Samba chicken biryani served with onion raita and brinjal gravy.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=600&auto=format&fit=crop',
        category: 'lunch',
        isVeg: false,
        stock: 50,
        rating: 4.9
    },
    {
        name: 'Veg Fried Rice',
        description: 'Basmati rice stir-fried with fresh vegetables and aromatic Chinese spices.',
        price: 85,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop',
        category: 'lunch',
        isVeg: true,
        stock: 90,
        rating: 4.3
    },
    {
        name: 'Executive Mini Meals',
        description: 'A balanced lunch with rice, sambar, rasam, kootu, poriyal, and curd.',
        price: 75,
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=600&auto=format&fit=crop',
        category: 'lunch',
        isVeg: true,
        stock: 120,
        rating: 4.4
    },

    // Snacks
    {
        name: 'Corn Cheese Sandwich',
        description: 'Grilled sandwich stuffed with sweet corn, spices, and mozzarella cheese.',
        price: 55,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop',
        category: 'snacks',
        isVeg: true,
        stock: 60,
        rating: 4.2
    },
    {
        name: 'Crispy Samosa (2 Pcs)',
        description: 'Spiced potato filling in a crispy pastry shell, served with mint and tamarind chutney.',
        price: 30,
        image: 'https://images.unsplash.com/photo-1601050633647-81a35d37c3c1?q=80&w=600&auto=format&fit=crop',
        category: 'snacks',
        isVeg: true,
        stock: 150,
        rating: 4.7
    },
    {
        name: 'Bhel Puri',
        description: 'Classic Indian street food made with puffed rice, veggies, and tangy chutneys.',
        price: 50,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?q=80&w=600&auto=format&fit=crop',
        category: 'snacks',
        isVeg: true,
        stock: 70,
        rating: 4.1
    },

    // Juices
    {
        name: 'Fresh Watermelon Juice',
        description: '100% natural, chilled watermelon juice with no added preservatives.',
        price: 40,
        image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=600&auto=format&fit=crop',
        category: 'juices',
        isVeg: true,
        stock: 80,
        rating: 4.5
    },
    {
        name: 'Mango Shake',
        description: 'Rich and creamy mango milkshake topped with almond slivers.',
        price: 75,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=600&auto=format&fit=crop',
        category: 'juices',
        isVeg: true,
        stock: 45,
        rating: 4.8
    },
    {
        name: 'Lemon Mint Mojito',
        description: 'Refreshing blend of lime, fresh mint leaves, and sparkling soda.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop',
        category: 'juices',
        isVeg: true,
        stock: 100,
        rating: 4.6
    },

    // North Indian
    {
        name: 'Paneer Butter Masala',
        description: 'Creamy and rich tomato-based gravy with soft paneer cubes, served with 2 Butter Phulkas.',
        price: 130,
        image: 'https://images.unsplash.com/photo-1567184109191-38aef2117546?q=80&w=600&auto=format&fit=crop',
        category: 'north-indian',
        isVeg: true,
        stock: 40,
        rating: 4.9
    },
    {
        name: 'Chole Bhature',
        description: 'A spicy, tangy chickpea curry served with two large fried fluffy breads.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1626132646529-50063753238a?q=80&w=600&auto=format&fit=crop',
        category: 'north-indian',
        isVeg: true,
        stock: 50,
        rating: 4.7
    },
    {
        name: 'Dal Makhani',
        description: 'Slow-cooked black lentils in a creamy butter and tomato sauce, served with Jeera Rice.',
        price: 110,
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=600&auto=format&fit=crop',
        category: 'north-indian',
        isVeg: true,
        stock: 35,
        rating: 4.5
    },

    // South Indian
    {
        name: 'South Indian Thali',
        description: 'A complete meal with Rice, Sambar, Rasam, Kootu, Poriyal, Curd, Appalam, and a sweet.',
        price: 90,
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=600&auto=format&fit=crop',
        category: 'south-indian',
        isVeg: true,
        stock: 150,
        rating: 4.4
    },
    {
        name: 'Medu Vada (2 Pcs)',
        description: 'Crispy lentil doughnuts with a soft center, served with coconut chutney and sambar.',
        price: 40,
        image: 'https://images.unsplash.com/photo-1626132646529-50063753238a?q=80&w=600&auto=format&fit=crop',
        category: 'south-indian',
        isVeg: true,
        stock: 100,
        rating: 4.3
    },
    {
        name: 'Lemon Rice',
        description: 'Refreshing and tangy rice dish tempered with mustard, peanuts, and lemon juice.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
        category: 'south-indian',
        isVeg: true,
        stock: 80,
        rating: 4.2
    },

    // Beverages
    {
        name: 'Filter Coffee',
        description: 'Traditional Kumbakonam Degree Filter coffee served hot and frothy.',
        price: 25,
        image: 'https://images.unsplash.com/photo-1544787210-22db340e7121?q=80&w=600&auto=format&fit=crop',
        category: 'beverages',
        isVeg: true,
        stock: 200,
        rating: 4.9
    },
    {
        name: 'Masala Tea',
        description: 'Aromatic tea infused with ginger, cardamom, and special spice blend.',
        price: 20,
        image: 'https://images.unsplash.com/photo-1563170335-d72b260e03ca?q=80&w=600&auto=format&fit=crop',
        category: 'beverages',
        isVeg: true,
        stock: 150,
        rating: 4.7
    },
    {
        name: 'Iced Coffee',
        description: 'Perfectly brewed cold coffee served with vanilla ice cream scoop.',
        price: 85,
        image: 'https://images.unsplash.com/photo-1517701604599-bb23b335c7a6?q=80&w=600&auto=format&fit=crop',
        category: 'beverages',
        isVeg: true,
        stock: 70,
        rating: 4.6
    },

    // Desserts
    {
        name: 'Gulab Jamun (2 Pcs)',
        description: 'Soft and succulent milk-based dumplings soaked in cardamom-flavored sugar syrup.',
        price: 35,
        image: 'https://images.unsplash.com/photo-1548840410-ad2acc593a10?q=80&w=600&auto=format&fit=crop',
        category: 'desserts',
        isVeg: true,
        stock: 30,
        rating: 4.8
    },
    {
        name: 'Chocolate Brownie',
        description: 'Warm, fudgy chocolate brownie served with a drizzle of hot chocolate sauce.',
        price: 80,
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop',
        category: 'desserts',
        isVeg: true,
        stock: 25,
        rating: 4.9
    },
    {
        name: 'Rasmalai (2 Pcs)',
        description: 'Soft cottage cheese patties soaked in thickened saffron-infused milk.',
        price: 70,
        image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=600&auto=format&fit=crop',
        category: 'desserts',
        isVeg: true,
        stock: 20,
        rating: 4.7
    }
];

const seedFood = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing products
        await Product.deleteMany();
        console.log('Existing items cleared.');

        // Insert new food items
        await Product.insertMany(foods);
        console.log('Professional KEC Food Court items seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedFood();

