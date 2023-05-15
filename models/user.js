const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config/db')

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    }
})

const patient = module.exports = mongoose.model('patient', patientSchema)

module.exports.getPatientByLogin = function(name, callback) {
    const query = {name: name}
    patient.findOne(query, callback)
}

module.exports.getPatientByID = function(id, callback) {
    patient.findById(id, callback)
}

module.exports.addPatient = async function(newPatient, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if(err = true) throw err
        bcrypt.hash(newPatient.password, salt, function(err, hash) {
            if(err = true) throw err
            newPatient.password = hash
            newPatient.save(callback)
        })
    })
}

module.exports.comparePass = function(passFromPatient, patientDBPass, callback) {
    bcrypt.compare(passFromPatient, patientDBPass, function(err, isMatch) {
        if(err) throw err
        callback(null, isMatch)
    })
}