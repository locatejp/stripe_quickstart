// LOAD ENV VARS FROM .ENV FILE INTO PROCESS.ENV
require("dotenv").config()

// SETUP EXPRESS
const express = require("express")
const app = express()
app.use(express.json())

// SETUP STRIPE
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

// THIS IS THE LIST OF ITEMS WE ARE SELLING
// THIS WILL MOST LIKELY COME FROM A DATABASE OR JSON FILE
const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Brass Monkey" }],
  [2, { priceInCents: 15000, name: "Funky Monkey" }],
])

// start up our server on port 3000
app.listen(3000)

// CREATE A POST REQUEST FOR /CREATE-CHECKOUT-SESSION
app.post("/create-checkout-session", async (req, res) => {
  try {
    // CREATE A CHECKOUT SESSION WITH STRIPE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // FOR EACH ITEM USE THE ID TO GET ITS INFORMATION
      // TAKE THAT INFOMATION AND CONVERT IT TO STRIPE'S FORMAT
      line_items: req.body.items.map(({ id, quantity }) => {
        const storeItem = storeItems.get(id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: quantity,
        }
      }),
      mode: "payment",
      // SET A SUCCESS AND CANCEL URL WE WILL SEND CUSTOMERS TO
      // THESE MUST BE FULL URLS
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    })
    res.json({ url: session.url })
  } catch (e) {
    // IF THERE IS AN ERROR SEND IT TO THE CLIENT
    res.status(500).json({ error: e.message })
  }
})
