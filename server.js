const express = require('express');
const app = express();

// Define port 
const port = process.env.PORT || 8000;

const morgan = require('morgan'); // Logger middleware for HTTP requests
const dotenv = require('dotenv'); // To load environment variables from config.env
const mongoose = require('mongoose'); // MongoDB ODM

// Enable logging only in development mode
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Load environment variables from config.env file
dotenv.config({
    path: './config.env'
});


//  *Middlewares* Parse incoming JSON requests
app.use(express.json());

// Test route (Home route)
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

// Start Server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Database Connection

// Connect to MongoDB 
mongoose.connect(`${process.env.DATABASE_URL}`)
    .then(() => console.log('Connected!'))
    .catch(err => console.log(err));

// Mongoose Schema & Model

// Define Category schema
const categorySchema = new mongoose.Schema({
    name: String, 
});

// Create model from schema
const Category = mongoose.model('Category', categorySchema);

// Routes

// Create new category
app.post("/", async (req, res) => {
    try {
        const name = req.body.name;

        const newCategory = new Category({ name });

        const doc = await newCategory.save();

        res.json(doc);
    } catch (err) {
        // Handle errors
        res.status(500).json(err);
    }
});

// Get All Categories
app.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find();

        res.json({
            results: categories.length,
            data: categories
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching categories',
            error: err.message
        });
    }
});