const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');





//Bring the User models
let User = require('../models/user');


//Register Form
router.get('/register', function(req, res){
  res.render('register');
});

//Register Process
router.post('/register',
  [
    check('name').isLength({min: 1}).trim().withMessage('Name is required'),
    check('email').isLength({min: 1}).trim().withMessage('Email is required'),
    check('username').isLength({min: 1}).trim().withMessage('Username is required'),
  ],
   function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  //req.checkBody('name', 'Name is required').notEmpty();
  //req.checkBody('email', 'Email is required').notEmpty();
  //req.checkBody('email', 'Email is not valid').isEmail();
  //req.checkBody('username', 'Username is required').notEmpty();
  //req.checkBody('password', 'Password is required').notEmpty();
  //req.checkBody('password2', 'Passwords do not match').equals(req.body.password);



  let errors = validationResult(req);

  if(errors){
    console.log('errors',errors)
    res.render('register', {
      errors:"Some Error Occured"
    });
  }else{
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now Registered and can Log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});




router.get('/login', function(req, res){
  res.render('login');
});



module.exports = router;
