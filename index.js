const express = require('express'),
app = express(),
MercadoPago = require('mercadopago');

require('dotenv').config();

MercadoPago.configure({
  sandBox: process.env.IS_SANDBOX,
  access_token: process.env.ACCESS_TOKEN
});


// Dummy data for testing /////////////////////
  let product = {
    name: 'Game: Control',
    description: 'A game for Xbox Series S and Playstation 5',
    value: 9.99
  };

  let user = {
    name: 'Victor',
    email: 'victor@mail.com'
  };
///////////////////////////////////////////////


app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/pay", async (req, res) => {
  let id = toString(Date.now());

  const data = {
    items: [
      item = {
        id,
        title: product.name,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: parseFloat(product.value) //needs to be float
      }
    ],
    payer: {
      email: user.email
    },
    external_reference: id
  };   // these fields must be saved on database!

  try {
    let payment = await MercadoPago.preferences.create(data);
    console.log(payment);

    //database save data
    
    return res.redirect(payment.body.init_point);

  } catch (err) {
    return res.send(err.message);
  }

});

app.listen(8080, (req, res) => {
  console.log("Server running.");
});
