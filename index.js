const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Load environment variables from .env
require('dotenv').config();

const port = process.env.PORT || 5000;

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

// Access MongoDB collections
const db = client.db(process.env.MONGODB_DB_NAME);
const usersCollection = db.collection('users');
const productsCollection = db.collection('products');

// app initialization
const app = express();

// Middleware to set collections
app.use((req, res, next) => {
  req.usersCollection = usersCollection;
  req.productsCollection = productsCollection;
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('server is running');
});

// Port connection
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

module.exports = {
    usersCollection,
    productsCollection,
  };
