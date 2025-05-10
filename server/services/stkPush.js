const axios = require('axios');
const getMpesaAccessToken = require('./darajaAuth.js');
const stkPushURL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';


const stkPayment = async(args) => {
    const requestData = {    
        "BusinessShortCode": process.env.BUSINESSSHORTCODE,    
        "Password": process.env.STKPASSWORD,    
        "Timestamp": "20160216165627",        
        "TransactionType": "CustomerPayBillOnline",    
        "Amount": `${args.amount}`,        
        "PartyA": `${args.paymentNumber}`,    
        "PartyB": process.env.PARTYB,    
        "PhoneNumber": `${args.paymentNumber}`,     
        "CallBackURL": process.env.STKCALLBACK, // ???? change to a relative path
        "AccountReference":"Test",    
        "TransactionDesc":"Test"
    };
    
    try {
        const token  = await getMpesaAccessToken();
        
        const response = await axios.post(stkPushURL, requestData,  {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (err) {
        console.log('Error at stkPayment:', err);
        return err
    }
};

module.exports = stkPayment;



