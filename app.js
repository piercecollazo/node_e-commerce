var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
let methodOverride = require('method-override')
require('dotenv').config()

let MongoStore = require('connect-mongo')(session)

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users/users');
const productRouter = require('./routes/product/product');
const adminRouter = require('./routes/admin/admin')
const cartRouter = require('./routes/cart/cart')

let Category = require('./routes/product/models/Category')
let Product = require('./routes/product/models/Product')
let cartMiddleware = require('./routes/cart/utils/cartMiddleware')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then( ()=>{
    console.log('MongoDB connected!')
  })
  .catch((error)=>{
    console.log(`MongoDB connection error: ${error}`)
  })

  
  var app = express();
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(methodOverride('_method'))

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({url: process.env.MONGODB_URI, autoReconnect: true}),
    cookie:{
      secure: false,
      maxAge: process.env.COOKIE_LENGTH
    }
  }))
  
  app.use(flash())
  
  app.use(passport.initialize())
  app.use(passport.session())
  
require('./lib/passport/passport')(passport)

app.use(function (req, res, next){
  res.locals.user = req.user
  
  res.locals.error = req.flash('error')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')

  next()
})

app.use((req, res, next)=>{
  Category.find({})
    .then(categories =>{
      res.locals.categories = categories

      next()
    })
    .catch(error => {
      return next(error)
    })
})

app.use(cartMiddleware)

app.use((req, res, next)=>{
  res.locals.search = req.body.search

  next()
})


app.use(expressValidator({
  errorFormatter: (param,message,value)=>{
    let namespace = param.split('.')
    let root = namespace.shift()
    let formParam = root

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']'
    }

    return {
      param: formParam,
      message: message,
      value: value
    }
  }
}))

app.use('/', indexRouter);

app.use('/api/cart', cartRouter);

app.use('/api/users', usersRouter);

app.use('/api/product', productRouter)

app.use('/api/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
