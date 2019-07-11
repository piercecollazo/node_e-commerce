let LocalStrategy = require('passport-local')
let User = require('../../routes/users/models/User')
let bcrypt = require('bcryptjs')

module.exports = (passport)=>{
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })


    passport.deserializeUser((id, done)=>{
        User.findById(id, (error, user)=>{
            done(error, user)
        })
    })

    passport.use('local-login',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, (req,email,password,done)=>{
            User.findOne({email: email}, (error,user)=>{
                if(error){
                    return done(error,null)
                }

                if(!user){
                    done(null, false, req.flash('loginMessage', 'User does not exists!'))
                }

                bcrypt.compare(password, user.password)
                    .then((result)=>{
                        if(!result){
                            return done(null, false, req.flash('loginMessage', 'Check email or password'))
                        } else{
                            return done(null,user)
                        }
                    })
                    .catch(error => {
                        throw error
                    })
            })
        })
    )
}