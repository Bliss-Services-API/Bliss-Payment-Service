'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/routes.js');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', paymentRoutes());

app.listen(PORT, () => console.log(`Server is Listening on Port ${PORT}`));