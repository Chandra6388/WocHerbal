const axios = require('axios');
const User = require('../models/User');
const ShiprocketOrder = require('../models/shiprocketOrder');
require('dotenv').config();

let shiprocketToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {

    if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
        return shiprocketToken;
    }
    let user = await User.findOne({ role: "admin" }).select('accessToken');

    if (user && user.accessToken) {
        shiprocketToken = user.accessToken;
        return shiprocketToken;
    }
    console.log("Genrate new token");


    const loginRes = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
    });
    shiprocketToken = loginRes?.data?.token;
    await User.updateOne({ role: "admin" }, { accessToken: shiprocketToken });
    // 10 days expiry
    tokenExpiry = Date.now() + 10 * 24 * 60 * 60 * 1000;
    return shiprocketToken;
}

function getAxiosInstance() {
    const instance = axios.create({
        baseURL: 'https://apiv2.shiprocket.in',
    });
    instance.interceptors.request.use(async (config) => {
        const token = await getShiprocketToken();

        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    });
    return instance;
}

function UpdateUserAccessToken() {
    User.findOneAndUpdate({ role: "admin" }, { accessToken: null })
        .then(() => {
            console.log("User access token updated successfully");
            shiprocketToken = null; // Reset token in memory
            tokenExpiry = null; // Reset token expiry

        })
        .catch((error) => {
            console.error("Error updating user access token:", error);
        });
}
const shiprocket = getAxiosInstance();

exports.login = async (req, res) => {
    try {
        const token = await getShiprocketToken();
        res.status(200).json({ status: 'success', token });
    } catch (error) {
        console.log("Ss", error)
        console.error('Shiprocket login error:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getServiceability = async (req, res) => {
    try {
        const { delivery_postcode, cod = 0, weight = 0.5 } = req.body;
        let pickup_postcode = 466001;

        const response = await shiprocket.get('/v1/external/courier/serviceability/', {
            params: { pickup_postcode, delivery_postcode, cod, weight }
        });


        const courierCompanies = response.data.data?.available_courier_companies || [];
        res.status(200).json({ available: courierCompanies.length > 0, couriers: courierCompanies });
    } catch (error) {
        console.log("res", error.response?.data);
        console.error('Error in getServiceability:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        console.log("orderData",req.body)
        const response = await shiprocket.post('/v1/external/orders/create/adhoc', orderData);
        const data = response.data;
        // Save to DB
        await ShiprocketOrder.create({
            orderId: data.order_id,
            shipmentId: data.shipment_id,
            awbCode: data.awb_code,
            courierName: data.courier_name,
            pickupInfo: orderData.pickup_location,
            manifestLink: '',
            labelPdfLink: '',
            invoicePdfLink: '',
            trackingStatus: 'Created'
        });
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.assignAwb = async (req, res) => {
    try {
        const { shipment_id, courier_id } = req.body;
        const response = await shiprocket.post('/v1/external/courier/assign/awb', { shipment_id, courier_id });
        const data = response.data;
        await ShiprocketOrder.findOneAndUpdate({ shipmentId: shipment_id }, { awbCode: data.awb_code, courierName: data.courier_name });
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        console.error('Error in assignAwb:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.generatePickup = async (req, res) => {
    try {
        const { shipment_id } = req.body;
        const response = await shiprocket.post('/v1/external/courier/generate/pickup', { shipment_id });
        res.status(200).json({ status: 'success', data: response.data });
    } catch (error) {
        console.error('Error in generatePickup:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.generateManifest = async (req, res) => {
    try {
        const { shipment_id } = req.body;
        const response = await shiprocket.post('/v1/external/manifests/generate', { shipment_id });
        const manifestLink = response.data.manifest_url;
        await ShiprocketOrder.findOneAndUpdate({ shipmentId: shipment_id }, { manifestLink });
        res.status(200).json({ status: 'success', manifestLink });
    } catch (error) {
        console.error('Error in generateManifest:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.printManifest = async (req, res) => {
    try {
        const { shipment_id } = req.body;
        const response = await shiprocket.post('/v1/external/manifests/print', { shipment_id });
        res.status(200).json({ status: 'success', pdf: response.data });
    } catch (error) {
        console.error('Error in printManifest:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.generateLabel = async (req, res) => {
    try {
        const { shipment_id } = req.body;
        const response = await shiprocket.post('/v1/external/courier/generate/label', { shipment_id });
        const labelPdfLink = response.data.label_url;
        await ShiprocketOrder.findOneAndUpdate({ shipmentId: shipment_id }, { labelPdfLink });
        res.status(200).json({ status: 'success', labelPdfLink });
    } catch (error) {
        console.error('Error in generateLabel:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.printInvoice = async (req, res) => {
    try {
        const { shipment_id } = req.body;
        const response = await shiprocket.post('/v1/external/orders/print/invoice', { shipment_id });
        const invoicePdfLink = response.data.invoice_url;
        await ShiprocketOrder.findOneAndUpdate({ shipmentId: shipment_id }, { invoicePdfLink });
        res.status(200).json({ status: 'success', invoicePdfLink });
    } catch (error) {
        console.error('Error in printInvoice:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};

exports.trackShipment = async (req, res) => {
    try {
        const { awb_code } = req.params;
        const response = await shiprocket.get(`/v1/external/courier/track/awb/${awb_code}`);
        const trackingStatus = response.data.status;
        await ShiprocketOrder.findOneAndUpdate({ awbCode: awb_code }, { trackingStatus });
        res.status(200).json({ status: 'success', tracking: response.data });
    } catch (error) {
        console.error('Error in trackShipment:', error.message);
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
};


exports.getOrders = async (req, res) => {
    try {
        const response = await shiprocket.get('/v1/external/orders');
        res.status(200).json({ status: 'success', data: response.data });
    } catch (error) {
        let ErrorMessage = error?.response?.data?.message || error.message;
        if (ErrorMessage.includes("Wrong number of segments")) {
            shiprocketToken = null; // Reset token to force re-login
            UpdateUserAccessToken(); // Clear access token in DB
        }
        res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'Internal Server Error' });
    }
}
