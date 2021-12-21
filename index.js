const express = require('express'),
app = express(),
MercadoPago = require('mercadopago');

require('dotenv').config();

MercadoPago.configure({
  sandBox: process.env.IS_SANDBOX,
  access_token: process.env.ACCESS_TOKEN
});


app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(8080, (req, res) => {
  console.log("Server running.");
});
