let express = require('express')
let router = express.Router()
let cartController = require('./controllers/cartController')
let Cart = require('../cart/models/Cart')
let stripe = require('stripe')('sk_test_o4xq5GyQgr8fXrDiH7qxxP8900jNBLrHmp')
let async = require('async')
let User = require('../users/models/User')

router.get('/', cartController.getUserShoppingCart)

router.post('/product/', cartController.addProductToCart)

router.delete('/remove', cartController.removeProduct)

router.post('/payment', (req, res)=>{
    let stripeToken = req.body.stripeToken
    let currentCharges = req.body.stripeMoney * 100
    // console.log(stripeToken)
    // console.log(currentCharges)
    stripe.customers
        .create({
            source: stripeToken
        })
        .then(customer =>{
            let results = stripe.charges.create({
                amount: currentCharges,
                currency: 'usd',
                customer: customer.id
            })

            return results
        })
        .then(results =>{
            async.waterfall([
                (callback)=>{
                    Cart.findOne({owner: req.user._id}, (error,cart)=>{
                        callback(error, cart)
                    })
                },
                (cart, callback)=>{
                    User.findOne({_id: req.user._id}, (error, user)=>{
                        if(user){
                            for(let i = 0; i < cart.items.length; i++){
                                user.history.push({
                                    item: cart.items[i].item,
                                    paid: cart.items[i].price
                                })
                            }
                            user.save((error, user)=>{
                                if(error) return next(error)

                                callback(error, user)
                            })
                        }
                    })
                },
                (user)=>{
                    Cart.update({
                        owner:req.user._id
                    },{
                        $set: {
                            items: [],
                            total: 0
                        }
                    },
                    (error, updated)=>{
                        if(updated) res.send('Payment done successfully :)')
                    })
                }
            ])
        })
        .catch(error => {
            let errors = {}
            errors.status = 500
            errors.message = error

            res.json(errors)
        })
})

module.exports = router