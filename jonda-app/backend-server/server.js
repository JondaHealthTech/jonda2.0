const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4242;

if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post('/create-payment-intent', async (req, res) => {
  try {
    
    const { amount, currency = 'usd' } = req.body;
    console.log('Creating payment intent with amount:', amount, 'and currency:', currency);
    // Simple payment intent - NO customer needed
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    // Return ONLY the client secret
    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/config', (req, res) => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      return res.status(500).json({ 
        error: 'Stripe publishable key not configured' 
      });
    }

    res.json({
      publishableKey: publishableKey
    });
  } catch (error) {
    console.error('Error getting config:', error);
    res.status(500).json({ error: 'Failed to get configuration' });
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: path.join(__dirname, 'uploads', req.file.filename),
    });
            
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});