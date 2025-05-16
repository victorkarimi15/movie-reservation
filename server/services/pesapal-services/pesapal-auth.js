const axios = require('axios');
const CONSUMERKEY = process.env.CONSUMER_KEY;
const CONSUMERSECRET = process.env.CONSUMER_SECRET;
const base64Encoded = Buffer.from(CONSUMERKEY + ':' + CONSUMERSECRET ).toString('base64');
const pesapalAuthURL = 'https://pay.pesapal.com/v3/api/Auth/RequestToken';

const generatePesapalToken = async () => {
    const token = await axios.post(pesapalAuthURL ,{
        Headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        

    })
}