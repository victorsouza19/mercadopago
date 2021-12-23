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
  res.json({hello: "Hello world"});
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
    // console.log(payment);

    //database save data
    
    return res.redirect(payment.body.init_point);

  } catch (err) {
    return res.send(err.message);
  }

});

app.post("/notification", (req, res) => {
  const { id } = req.query;

  setTimeout(() => {
    let filter = {
      "order.id": id
    }

    MercadoPago.payment.search({qs: filter})
    .then(data => {
      console.log(data);

    }).catch(err => {
      let payment = data.body.results[0];

      if(payment != undefined){
        console.log(payment);
      }else{
        console.log("Payment not found.");
      }

    })

  }, 20000);

  res.status(200);
  res.send("OK");
})

const PORT = process.env.PORT || 3303;
app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
 });
