const axios = require('axios');

async function testAPI() {
    try {
        console.log('Hitting /api/reservations/all without token...');
        await axios.get('http://localhost:5000/api/reservations/all');
    } catch (error) {
        if (error.response) {
            console.log(`Response Status: ${error.response.status}`);

            if (error.response.status === 401) {
                console.log('SUCCESS: Endpoint exists (returned 401 Unauthorized)');
            } else if (error.response.status === 404) {
                console.log('FAILURE: Endpoint not found (404)');
            } else {
                console.log(`Unexpected Status: ${error.response.status}`);
            }
        } else {
            console.log('Network Error:', error.message);
        }
    }
}

testAPI();
