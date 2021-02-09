// const braintree = require("braintree");

// const gateway = new braintree.BraintreeGateway({
 
  
//     environment:  braintree.Environment.Sandbox,
//     merchantId:   'v86286r6jyf3p2jp',
//     publicKey:    'cvr9vthzncy7tz9v',
//     privateKey:   '4861919642b69180ac03f1d4211901af'
// });

// exports.getToken = (req, res) => {
//   gateway.clientToken.generate({}, function(err, response) {
//     if (err) {
//       res.status(500).json(err);
//     } else {
//       res.send(response);
//     }
//   });
// };

// exports.processPayment = (req, res) => {
//   let nonceFromTheClient = req.body.paymentMethodNonce;

//   let amountFromTheClient = req.body.amount;
//   gateway.transaction.sale(
//     {
//       amount: amountFromTheClient,
//       paymentMethodNonce: nonceFromTheClient,

//       options: {
//         submitForSettlement: true
//       }
//     },
//     function(err, result) {
//       if (err) {
//         res.status(500).json(error);
//       } else {
//         res.json(result);
//       }
//     }
//   );
// };


const stripe = require("stripe")("sk_test_51HkMrTD7t673YzWnHPS5oEl9zEXnEqcDQa6lfZwHolZFcmIwRVWVB33MJ9o1OFGqzM6Ecqwvg0tEMFbKghHLph46007QzWxTFm");
const uuid = require("uuid/v4");
exports.processPayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS", products);

  let amount = 0 ;
  products.map(p => {
    amount = amount + p.price;
  });
  const idempotencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id
    })
    .then(customer => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchased the product`,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip
              }
            }
          },
          {
            idempotencyKey
          }
        )
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
    })
    .catch(console.log("FAILED"));
};