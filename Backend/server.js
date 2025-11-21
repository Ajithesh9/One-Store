require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');   // NEW: Import Orders
const paymentRoutes = require('./routes/paymentRoutes'); // NEW: Import Payments

const app = express();

connectDB(); // Connect to Database

app.use(express.json()); 
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);     // NEW: Enable Orders URL
app.use('/api/payment', paymentRoutes);  // NEW: Enable Payments URL

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));