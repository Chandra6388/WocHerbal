const express = require('express');
const router = express.Router();

const {
  login,
  getServiceability,
  createOrder,
  assignAwb,
  generatePickup,
  generateManifest,
  printManifest,
  generateLabel,
  printInvoice,
  trackShipment,
  getOrders,
  cancelShipment,
  cancelorder
} = require('../controllers/rocketShippment');

router.post('/login', login);
router.post('/getServiceability', getServiceability);
router.post('/createOrder', createOrder);
router.post('/assignAwb', assignAwb);
router.post('/generatePickup', generatePickup);
router.post('/generateManifest', generateManifest);
router.post('/printManifest', printManifest);
router.post('/generateLabel', generateLabel);
router.post('/printInvoice', printInvoice);
router.get('/trackShipment/:awb_code', trackShipment);
router.get('/getOrders', getOrders);
router.post('/cancelShipment', cancelShipment);
router.post('/cancelorder', cancelorder);

module.exports = router; 