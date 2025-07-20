const axios = require('axios');
const User = require('../models/User');


exports.getServiceability = async (req, res) => {
    try {
        const { _id, pickup_postcode, delivery_postcode, cod = 0, weight = 0.5 } = req.body;


        await User.findByIdAndUpdate(_id, {
            $set: {
                pincode: delivery_postcode
            }
        });

        const loginRes = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.Email,
            password: process.env.password
        });

        const token = loginRes?.data?.token;

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Failed to authenticate with Shiprocket. Token not received.'
            });
        }


        const response = await axios.get(
            'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    pickup_postcode,
                    delivery_postcode,
                    cod,
                    weight
                }
            }
        );

        const courierCompanies = response.data;

        if (Array.isArray(courierCompanies) && courierCompanies.length > 0) {
            return res.status(200).json({
                available: true,
                message: 'Product is deliverable to this location.'
            });
        } else {
            return res.status(200).json({
                available: false,
                message: 'Product is not deliverable to this location.'
            });
        }

    } catch (error) {
        console.error('Error in getServiceability:', error.message);
        return res.status(error.response?.status || 500).json({
            status: 'error',
            message: error.response?.data?.message || 'Internal Server Error'
        });
    }
};
