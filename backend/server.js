const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const menuItems = require('./menuitems.json');
const ordersFilePath = './orders.json';
const cartFilePath = './cart.json';


// Helper function to read data from a JSON file
const readFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading from file ${filePath}:`, error);
    return [];
  }
};

// Helper function to write data to a JSON file
const writeToFile = (filePath, data) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log(`Written data to file ${filePath}:`, jsonData); // Add logging
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
  }
};

// Load initial orders and cart from files
let orders = readFromFile(ordersFilePath);
let cart = readFromFile(cartFilePath);

// Endpoint to get menu items
app.get('/', (req, res) => {
  res.json(menuItems);
});

// Endpoint to handle orders
app.post('/order', (req, res) => {
  console.log('Received order:', req.body); // Add logging
  const order = {
    id: Date.now(),
    date: new Date(),
    items: req.body.items
  };

  orders.push(order);
  writeToFile(ordersFilePath, orders);
  cart = []; // Clear the cart after placing the order
  writeToFile(cartFilePath, cart);
  res.json({ message: 'Order placed successfully', order: order });
});

// Endpoint to get past orders
app.get('/pastorders', (req, res) => {
  res.json(orders.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Endpoint to remove a past order
app.delete('/pastorders/:id', (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  orders = orders.filter(order => order.id !== orderId);
  writeToFile(ordersFilePath, orders);
  res.json({ message: 'Order removed successfully' });
});

// Endpoint to get the current cart items
app.get('/cart', (req, res) => {
  res.json(cart);
});

// Endpoint to add an item to the cart
app.post('/cart', (req, res) => {
  cart = req.body;
  writeToFile(cartFilePath, cart);
  res.json({ message: 'Item added to cart successfully' });
});

// Endpoint to clear the cart
app.delete('/cart', (req, res) => {
  cart = [];
  writeToFile(cartFilePath, cart);
  res.json({ message: 'Cart cleared successfully' });
});


app.listen(8080, () => {
  console.log(`Listening on port 8080`);
});
