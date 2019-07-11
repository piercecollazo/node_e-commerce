const User = require('../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('../utils/gravatar')
const passport = require('passport')

module.exports = {
    signup: (req, res, next)=>{
        let errorValidate = req.validationErrors()

        if(errorValidate){
        
          res.render('auth/signup', {error_msg: true, errorValidate: errorValidate, errors: []})
          return
        }

        console.log(req.body.email)

            User.findOne({email:req.body.email})
            .then(user => {
                if(user){
                    req.flash('errors', 'Email already exists')

                    return res.redirect(301, '/api/users/signup')
                } else {
                    const newUser = new User

                    newUser.profile.name = req.body.name
                    newUser.password = req.body.password
                    newUser.email = req.body.email
                    newUser.profile.picture = gravatar(req.body.email)

                    bcrypt.genSalt(10, (error, salt)=>{
                        if(salt){
                            bcrypt.hash(newUser.password, salt, (error, hash)=>{
                                if(error){
                                    throw error
                                }else{
                                    newUser.password = hash

                                    newUser.save()
                                        .then(user => {
                                            req.logIn(user, (error)=>{
                                                if(error){
                                                    res.status(400).json({
                                                        confirmation: false,
                                                        message: error
                                                    })
                                                } else {
                                                    next()
                                                }
                                            })
                                        })
                                        .catch(error =>{ 
                                            req.flash('errors', error)
                                            return res.redirect(301, '/api/users/signup')
                                        })
                                }
                            })
                        }
                    })
                }
            })
    },
    update: (params, id)=>{
        return new Promise((resolve, reject)=>{
            User.findById(id)
                .then(user=>{
                    if(!user){
                        let errors = {}
                        errors.message = 'Cannot find user'
                        errors.status = 400

                        reject(errors)
                    } else {

                        if(params.name)user.profile.name = params.name
                        if(params.password)user.password = params.password
                        if(params.email)user.email = params.email
                        if(params.address)user.address = params.address
                        
                        if(params.password){
                            bcrypt.genSalt(10, (error, salt)=>{
                                if(salt){
                                    bcrypt.hash(user.password, salt, (error, hash)=>{
                                        if(error){
                                            reject(error)
                                        }else{
                                            user.password = hash
                    
                                            user.save()
                                                .then(user => resolve(user))
                                                .catch(error => reject(error))
                                        }
                                    })
                        }
                    })
                        }
                    }
        })
        .catch(error => reject(error))
    })
    }
}