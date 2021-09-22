// USES THIS TUTORIAL: https://blog.webdevsimplified.com/2021-07/stripe-checkout/
// HOWEVER SO FAR THIS IS NOT WORKING
// THE CODE BELOW IS A CLIENT SIDE ACTION TO INITIATE A PURCHASE
// LIKE CLICKING A BUTTON
// INITIATE A POST REQUEST TO THE SERVER
// IF THE SERVER IS ON A DIFFERENT DOMAIN THAN THE CLIENT
// THEN THIS NEEDS TO BE THE FULL URL
// HTTP://LOCALHOST:3000/CREATE-CHECKOUT-SESSION

fetch("/create-checkout-session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  // SEND ALONG ALL THE INFORMATION ABOUT THE ITEMS
  body: JSON.stringify({
    items: [
      {
        id: 1,
        quantity: 2,
      },
      {
        id: 2,
        quantity: 1,
      },
    ],
  }),
})
  .then((res) => {
    if (res.ok) return res.json()
    // IF THERE IS AN ERROR THEN MAKE SURE WE CATCH THAT
    return res.json().then((e) => Promise.reject(e))
  })
  .then(({ url }) => {
    // ON SUCCESS REDIRECT THE CUSTOMER TO THE RETURNED URL
    window.location = url
  })
  .catch((e) => {
    console.error(e.error)
  })
