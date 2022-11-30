const express = require('express')
const leasesController =require('../controllers/leasesController')

const router =express.Router()

router.route('/').get(leasesController.getAllLeases).post(leasesController.addLease)
// router.route('/')

module.exports =router;