const Cart = require('../models/Cart')

module.exports = (req, res, next)=>{
    if(req.user){
        Cart.findOne({owner: req.user._id})
            .then(cart =>{
                if(cart){
                    let total = 0

                    for(let item of cart.items)total += item.quantity

                    res.locals.cart = total
                    next()
                } else {
                    res.locals.cart = 0

                    next()
                }
            })
            .catch(error => {
              let errors = {}
              errors.status = 500
              errors.message = error

              res.status(errors.status).json(errors)
            })
    } else {
        next()
    }
}