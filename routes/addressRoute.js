const express = require('express');

const authService = require('../controllers/authService');

const {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
} = require('../controllers/addressService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;