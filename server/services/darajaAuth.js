const axios = require('axios');
require('dotenv').config();
const CONSUMERKEY = process.env.CONSUMERKEY;
const CONSUMERSECRET = process.env.CONSUMERSECRET;
const base64encodedData = Buffer.from(CONSUMERKEY + ':' + CONSUMERSECRET).toString('base64');
const mpesaAuthURL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

const getMpesaAccessToken = async () => {
    try {
        const response = await axios.get(mpesaAuthURL,{
            headers: {
                "Content-Type": "Application/Json",
                Authorization: `Basic ${base64encodedData}`
            }
        });
        
        return response.data.access_token;
    } catch (err) {
      return console.error('Error getting Mpesa Access token:',err);  
    }
};


module.exports = getMpesaAccessToken;

