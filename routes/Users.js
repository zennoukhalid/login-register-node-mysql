const express = require('express')
const users = express.Router()
const router= require('express').Router();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const nodemailer = require('nodemailer');
const User = require('../Models/User')
users.use(cors())

process.env.SECRET_KEY = 'secret'



users.get('/', (req, res) => {
    User.findAndCountAll()
.then(result=>res.json({'data' : result['rows'],'count' : result['count'] } ))
.catch(err => res.status(400).json('Error: '+err));
})

users.get('/:id', (req, res) => {
  User.findOne(
   { where: {id: req.params.id}
    }
    
  )
.then(result=>res.json( result ))
.catch(err => res.status(400).json('Error: '+err));
})

users.delete('/dellete/:id', (req, res) => {
  User.destroy({
    where: {id: req.params.id},
  })
.then(result=>res.json({ result} ))
.catch(err => res.status(400).json('Error: '+err));
})

// /users/78   get users
// profs/54   get prof//il faut crytper le password avant update
users.put('/:id', (req, res) => {
  const today = new Date()
  const userDataUp = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    role: req.body.role,
    urlPhoto: req.body.urlPhoto,
    created: today
  }
  User.update(
    userDataUp,
    {where:{id: req.params.id}})
  .then(result=>res.json( result ))
.catch(err => res.status(400).json('Error: '+err));
})



users.post('/register', (req, res) => {
  const today = new Date()
  console.log(req.body)
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    urlPhoto: req.body.urlPhoto,
    created: today
  }
  

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    //TODO bcrypt
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              res.json({ status: user.email + ' Registered !' })
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
//login
users.post('/login', (req, res) => {
  console.log('login--------',req.body)
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user) {
        var result = bcrypt.compare(req.body.password, user.password);
        if (result) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          const data = {token : token , user : user} ;
          
          res.send(data)
         
        } else {
          res.status(400).json({ error: 'Password is not correct ' })       
         }              
      } else {
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

module.exports = users

