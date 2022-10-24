var express = require('express');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

var router = express.Router();

/* GET users listing. */
router.get('/displayProfil', function(req, res) {
  User.findOne({ token: req.body.token }).then(userFoundInDb => {
    if(userFoundInDb){ //récupération des données utiles uniquement. Pas de mot de passe en front
      res.json({result: true, userName: userFoundInDb.userName, firstName: userFoundInDb.firstName, sexe: userFoundInDb.sexe, email: userFoundInDb.email, phoneNumber: userFoundInDb.phoneNumber, address: userFoundInDb.address, favoriteTransportLine: userFoundInDb.favoriteTransportLine, profilPhoto: userFoundInDb.profilPhoto,showProfilPhoto: userFoundInDb.showProfilPhoto, showSexOnProfil: userFoundInDb.showSexOnProfil, registerDate: userFoundInDb.registerDate, emergencyTime: userFoundInDb.emergencyTime, score: userFoundInDb.score})
    }else{
      res.json({result: false })
    }
  }

  )
});

/* GET users listing. */
router.post('/signUp', function(req, res) {

  User.findOne({email: req.body.email}).then(
    userFoundInDb => {
      if(userFoundInDb){
        res.json({ result: false, error: 'user already exists'})
      }else{
        const newUser = new User({
          // firstName: req.body.firstName,
          // lastName: req.body.lastName,
          userName: req.body.userName,
          email:req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          token:uid2(32),
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
        newUser.save().then(newUser => {
          res.json({result: true, token: newUser.token, userName: newUser.userName})})
      }
    })
  })


  router.post('/update', function(req, res){
    User.findOne({token: req.body.token}).then(tokenFoundInDb => {
      if(tokenFoundInDb){
          if(req.body.firstName){
            User.findOneAndUpdate({token: req.body.token},{firstName: req.body.firstName}).then()          
          }
          if(req.body.lastName){
            User.findOneAndUpdate({token: req.body.token},{lastName: req.body.lastName},{new : true}).then()
          }
          if(req.body.userName){
            User.findOneAndUpdate({token: req.body.token},{userName: req.body.userName}).then()
          }
          if(req.body.email){
            User.updateOne({token: req.body.token},{$set: {email: req.body.email}}).then()
          }          
          if(req.body.password){
            User.findOneAndUpdate({token: req.body.token},{password: bcrypt.hashSync(req.body.password, 10)}).then()
          }
          if(req.body.birthdayDate){
            User.findOneAndUpdate({token: req.body.token},{birthdayDate: req.body.birthdayDate}).then()
          }
          if(req.body.sexe){
            User.findOneAndUpdate({token: req.body.token},{sexe: req.body.sexe}).then()
            console.log(req.body.sexe);
          }
          if(req.body.favoriteTransportLine){
            User.findOneAndUpdate({token: req.body.token},{favoriteTransportLine: req.body.favoriteTransportLine}).then()
          }
          if(req.body.travelingWithSameSex){
            User.findOneAndUpdate({token: req.body.token},{travelingWithSameSex: req.body.travelingWithSameSex}).then()
          }
          if(req.body.showProfilPhoto){
            User.findOneAndUpdate({token: req.body.token},{showProfilPhoto: req.body.showProfilPhoto})
          }
          if(req.body.showSexOnProfil){
            User.findOneAndUpdate({token: req.body.token},{showSexOnProfil: req.body.showSexOnProfil}).then()
          }
          // phoneNumber:[phoneNumbersSchema],
          // addresses: [addressesSchema],
          // favoriteTransportLine: req.body.,
          // profilPhoto:req.body.,
          res.json({result: true})
        }
      })
    })

    router.delete('/delete', function(req, res) {
      User.findOne({token: req.body.token}).then(tokenFoundInDb => {
        if(tokenFoundInDb){
          User.deleteOne({token: req.body.token}).then(userDeleted => { 
            if(userDeleted.deletedCount > 0){
                res.json({ result: true});
            }
            else {  
                res.json({ result: false, error: 'User cant be deleted' });
              }}
              )}
            })
          })

module.exports = router;
