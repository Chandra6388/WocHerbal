const axios = require('axios');
const User = require('../models/User');
const ShiprocketOrder = require('../models/shiprocketOrder');
const Order = require("../models/Order")
require('dotenv').config();
const { refundPayment } = require('../utils/razorpay');
let shiprocketToken = null;
let tokenExpiry = null;

// async function getShiprocketToken() {



















//     if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
//         return shiprocketToken;
//     }
//     let user = await User.findOne({ role: "admin" }).select('accessToken');
//     if (user && user.accessToken) {
//         shiprocketToken = user.accessToken;
//         return shiprocketToken;
//     }



//     const loginRes = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
//         email: process.env.SHIPROCKET_EMAIL,
//         password: process.env.SHIPROCKET_PASSWORD
//     });
//     console.log("ssssss", loginRes)
//     shiprocketToken = loginRes?.data?.token;
//     await User.updateOne({ role: "admin" }, { accessToken: shiprocketToken });
//     // 10 days expiry
//     tokenExpiry = Date.now() + 10 * 24 * 60 * 60 * 1000;
//     return shiprocketToken;
// }




// Update path as needed

async function getShiprocketToken() {
    try {
        // ✅ 1. In-memory cache check
        if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
            return shiprocketToken;
        }

        // ✅ 2. Check token in DB (with expiry)
        const user = await User.findOne({ role: "admin" }).select("accessToken tokenExpiry");

        if (
            user &&
            user.accessToken &&
            user.tokenExpiry &&
            new Date(user.tokenExpiry).getTime() > Date.now()
        ) {
            shiprocketToken = user.accessToken;
            tokenExpiry = new Date(user.tokenExpiry).getTime();
            return shiprocketToken;
        }

        // ✅ 3. Fetch new token from Shiprocket
        const loginRes = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD,
        });

        if (loginRes?.data?.token) {
            shiprocketToken = loginRes.data.token;

            // Set new expiry: 10 days from now
            tokenExpiry = Date.now() + 10 * 24 * 60 * 60 * 1000;

            // ✅ Save new token and expiry in DB
            await User.updateOne(
                { role: "admin" },
                {
                    accessToken: shiprocketToken,
                    tokenExpiry: new Date(tokenExpiry),
                }
            );

            return shiprocketToken;
        } else {
            throw new Error("Shiprocket token not received");
        }
    } catch (error) {
        console.error("Error getting Shiprocket token:", error.message);
        throw new Error("Unable to fetch Shiprocket token");
    }
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



exports.cancelShipment = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Step 1: Find Shiprocket Order
        const shiprocketOrder = await ShiprocketOrder.findOne({ orderId });
        if (!shiprocketOrder) {
            return res.status(404).json({ status: 'error', message: 'Shiprocket Order not found' });
        }

        // Step 2: Find Local Order
        const localOrder = await Order.findOne({ _id: shiprocketOrder.order_id });
        if (!localOrder) {
            return res.status(404).json({ status: 'error', message: 'Local Order not found' });
        }

        // Step 4: Cancel Shiprocket Order
        const cancelResponse = await shiprocket.post('/v1/external/orders/cancel/shipment/awbs', {
            ids: [Number(orderId)] // Ensure orderId is a number
        });
        if (cancelResponse.data.status_code != 200) {
            return res.status(404).json({ status: 'error', message: 'Error in shiprocket', error: cancelResponse.data });
        }

        // Step 3: Refund via Razorpay
        let refundResponse = await refundPayment(shiprocketOrder?.paymentInfo?.id, localOrder.totalPrice);

        if (refundResponse?.error?.code === "BAD_REQUEST_ERROR") {
            return res.status(400).json({ status: 'failed', message: refundResponse.error.description });
        }



        return res.status(200).json({ status: 'success', data: cancelResponse.data });
    } catch (error) {
        console.error('Error in cancelorder:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message || 'Internal Server Error',
        });
    }
}



exports.cancelorder = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Step 1: Find Shiprocket Order
        const shiprocketOrder = await ShiprocketOrder.findOne({ orderId });
        if (!shiprocketOrder) {
            return res.status(404).json({ status: 'error', message: 'Shiprocket Order not found' });
        }

        // Step 2: Find Local Order
        const localOrder = await Order.findOne({ _id: shiprocketOrder.order_id });
        if (!localOrder) {
            return res.status(404).json({ status: 'error', message: 'Local Order not found' });
        }

        // Step 4: Cancel Shiprocket Order
        const cancelResponse = await shiprocket.post('/v1/external/orders/cancel', {
            ids: [Number(orderId)] // Ensure orderId is a number
        });
        if (cancelResponse.data.status_code != 200) {
            return res.status(404).json({ status: 'error', message: 'Error in shiprocket', error: cancelResponse.data });
        }

        // Step 3: Refund via Razorpay
        let refundResponse = await refundPayment(shiprocketOrder?.paymentInfo?.id, localOrder.totalPrice);

        if (refundResponse?.error?.code === "BAD_REQUEST_ERROR") {
            return res.status(400).json({ status: 'failed', message: refundResponse.error.description });
        }



        return res.status(200).json({ status: 'success', data: cancelResponse.data });
    } catch (error) {
        console.error('Error in cancelorder:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || error.message || 'Internal Server Error',
        });
    }
};
