const mongoose = require('mongoose')
const Schema   = mongoose.Schema

let CartSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'user'},
    total: { type: Number, default: 0 },
    items: [{
        item:     { type: Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, default: 1 },
        price:    { type: Number, default: 0 },
        name:     { type: Schema.Types.ObjectId, ref: 'product'},
        image:    { type: Schema.Types.ObjectId, ref: 'product'}
    }]
})

module.exports = mongoose.model('cart', CartSchema)