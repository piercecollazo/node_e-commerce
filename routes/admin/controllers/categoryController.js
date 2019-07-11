const Category = require('../../product/models/Category')

module.exports = {
    add: (params)=>{
        return new Promise((resolve, reject)=>{
                    const newCategory = new Category()
                    newCategory.name = params.name
                    newCategory.save()
                        .then(category => resolve(category))
                        .catch(error => {
                            let errors = {}
                            errors.confirmation = false

                            if(error.code === 11000){
                                errors.message = 'Category already exists'
                            } else {
                                errors.message = error
                            }
                            reject(error)
                        })
                })

    },
    getAllCategories: (req, res)=>{
        Category.find({})
                .then(categories =>{
                    res.render('category/create-fake-product', {categories: categories, success: req.flash('createProductsSuccess')})
                })
                .catch(error => {
                    let errors = {}
                    errors.status = 500
                    errors.message = error
                    res.status(errors.status).json(errors)
                })

    }
}