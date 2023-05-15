const express = require('express')
const router = express.Router()
const patient = require('../models/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/db')


router.post('/reg', function(req, res) {
    let newPatient = new patient({
        name: req.body.name,
        password: req.body.password,
        city: req.body.city,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender
    })
    patient.addPatient(newPatient, function(err, patient) {
        if(err) {
            res.json({success: false, msg: "Користувач не додан"})
        } else {
            res.json({success: true, msg: "Користувач додан"})
        }
    })
})

router.post('/auth', function(req, res) {
    const name = req.body.name
    const password = req.body.password

    patient.getPatientByLogin(name, function(err, user) {
        if(err) throw err
        if(!user) {
            return res.json({success: false, msg: "Такого користувача не знайдено"})
        }
        
        patient.comparePass(password, user.password, function(err, isMatch) {
            if(err) throw err
            if(isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 3600 * 12
                })

                res.json({
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        city: user.city,
                        email: user.email,
                        phone: user.phone,
                        gender: user.gender
                    }
                } )
            } else {
                return res.json({success: false, msg: "Невірний пароль"})
            }
        })
    })
})

router.get('/dashboard', passport.authenticate('jwt', {session: false}), function(req, res) {
    res.send('Кабінет користувача')
})

module.exports = router