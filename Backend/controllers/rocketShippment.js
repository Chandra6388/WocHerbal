const axios = require('axios');

exports.getServiceability = async (req, res) => {
    try {
        const { pickup_postcode, delivery_postcode, cod = 0, weight = 0.5 } = req.body;

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

        // Step 2: Call serviceability API
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

        const courierCompanies = response.data?.data?.available_courier_companies;

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
