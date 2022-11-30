const express = require('express')
const leasesController =require('../controllers/leasesController')
const authController =require('../controllers/authController')

const router =express.Router()
router.use(authController.protect)
router.route('/').get(leasesController.getAllLeases).post(leasesController.addLease)
// router.route('/')

module.exports =router;