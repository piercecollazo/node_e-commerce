const express = require('express');
const router = express.Router();
const passport = require('passport')

let userController = require('../users/controllers/userController')
let signupValidation = require('./utils/signupValidation')
let productController = require('../product/controllers/productController')
let cartController = require('../cart/controllers/cartController')

/* GET users listing. */
router.get('/', productController.getAllProducts);

router.get('/signup', function(req, res, next) {
  if(req.isAuthenticated()){
    return res.redirect('/')
  }

  res.render('auth/signup', {errors:req.flash('errors'), error_msg:null});
});

router.post('/signup', signupValidation, userController.signup, cartController.createUserCart)


router.get('/signin', function(req, res, next) {
  if(req.isAuthenticated()){
    res.redirect('/')
  }
  res.render('auth/signin', {errors:req.flash('loginMessage')});
});

router.post('/signin', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/api/users/signin',
  failureFlash: true
}))


router.get('/logout', (req, res, next)=>{
  req.logout()

  res.redirect('/')
})

router.get('/edit-profile', (req, res, next)=>{
  if(req.isAuthenticated()){
    res.render('account/profile', {errors:req.flash('errors'), success: req.flash('success')})
  } else {
    res.redirect('/api/users/signin')
  }
})

router.post('/edit-profile', (req, res, next)=>{
  userController.update(req.body, req.user._id)
    .then(user => {
      req.flash('success', 'Successfully updated profile')
      res.redirect('/api/users/edit-profile')
    })
    .catch(error => {
      req.flash('errors', error)
      res.redirect('/api/users/edit-profile')
    })
})

router.get('/test', (req, res)=>{
  res.send('test worked')
})

module.exports = router;
