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
        "CallBackURL": process.env.STKCALLBACK, // TODO: change to a relative path
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
        logger.error('Error in initializing stkpayment', {
            error: err.message,
            stack: err.stack.split('\n').slice(0, 4).join(' '),
            ip: req.ip,
            agent: req.headers['user-agent']
        });
        
        return next(err)
    }
};

module.exports = stkPayment;



