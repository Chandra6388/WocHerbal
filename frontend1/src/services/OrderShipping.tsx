const axios = require('axios');

async function getShiprocketToken() {
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: 'cppatel6388@gmail.com',
      password: 'Kwdim@2@1gt@$sYy',
    });

    const token = response.data.token;
    console.log('Shiprocket Token:', token);
    return token;
  } catch (err) {
    console.error('Authentication Failed:', err.response?.data || err.message);
  }
}



const createOrder = async () => {
  const token = await getShiprocketToken();

  const response = await axios.post(
    'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
    {
      order_id: 'order1234',
      order_date: '2025-07-18',
      pickup_location: 'Your Warehouse Name',
      billing_customer_name: 'John Doe',
      billing_address: '123 Main Street',
      billing_city: 'New Delhi',
      billing_pincode: '110001',
      billing_state: 'Delhi',
      billing_country: 'India',
      billing_phone: '9876543210',
      order_items: [
        {
          name: 'Herbal Oil',
          sku: 'herbal-oil-100ml',
          units: 1,
          selling_price: 250,
        },
      ],
      payment_method: 'Prepaid',
      sub_total: 250,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('Order Created:', response.data);
};
