var express = require('express');
const User = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.post('/add', function(req, res) {

  User.findOne({email: req.body.email}).then(
    userFoundInDb => {
      if(userFoundInDb){
        res.json({ result: false, error: 'user already exists'})
      }else{
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          email:req.body.email,
          password:req.body.password,
          // phoneNumber:[phoneNumbersSchema],
          // birthdayDate:req.body.,
          // addresses: [addressesSchema],
          sexe: req.body.sexe,
          // favoriteTransportLine: req.body.,
          // profilPhoto:req.body.,
          // travelingWithSameSex: req.body.,
          // showProfilPhoto: req.body.,
          // showSexOnProfil: req.body.,
        })
      }
    }
  ).then(newUser.save()

  res.json({result: true, newUser});
});

module.exports = router;
