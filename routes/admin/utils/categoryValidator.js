function categoryValidation(req, res, next){
    req.checkBody('name', 'Category cannot be empty').notEmpty()
    let errorValidate = req.validationErrors()
    if(errorValidate){
        req.flash('errors', errorValidate[0].message)
        res.status(302).redirect('/api/admin/add-category')
    } else {
        next()
    }
}

module.exports = categoryValidation