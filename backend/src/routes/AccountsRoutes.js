const express = require('express');
const router = express.Router();


const AccountController = require('../controllers/Account');



router.post('/account/create', AccountController.createAccount);
router.get('/account/balance/:id', AccountController.getBalance);
router.put('/account/credit/', AccountController.creditBalance);
router.put('/account/debit/', AccountController.debitBalance);
router.put('/account/transfer/', AccountController.transferBalance);
router.put('/account/yieldInterest/', AccountController.yieldInterest);


module.exports = router;