let Product = require('../../product/models/Product')
let faker = require('faker')

module.exports = {
    createProductByID: (req, res)=>{
        for(let i = 0; i < 10; i++){
        let newProduct = new Product()
        newProduct.category = req.params.categoryID
        newProduct.name = faker.commerce.productName()
        newProduct.price = faker.commerce.price()
        newProduct.image = faker.image.image()
            
        newProduct.save()
        }
    req.flash('createProductsSuccess', `Fake ${req.params.categoryName} 10 products created!`)
   res.redirect('/api/admin/get-all-categories')
    }
}