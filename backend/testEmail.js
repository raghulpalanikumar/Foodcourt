require('dotenv').config();
const { sendOrderConfirmationEmail } = require('./utils/emailService');

const testEmail = async () => {
    try {
        console.log('Testing email service...');
        console.log('Using SMTP User:', process.env.SMTP_USER);

        await sendOrderConfirmationEmail(
            process.env.SMTP_USER, // Send to self
            'Test User',
            {
                orderId: 'TEST-123',
                tokenNumber: 'KEC-TEST',
                orderDate: new Date(),
                total: 100,
                items: [{ name: 'Test Food', quantity: 1, price: 100 }],
                shippingAddress: {
                    address: 'Test Address',
                    city: 'Test City',
                    postalCode: '123456',
                    country: 'Test Country'
                }
            }
        );
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    }
};

testEmail();
