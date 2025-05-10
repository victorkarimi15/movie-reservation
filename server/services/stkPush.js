const axios = require('axios');
const getMpesaAccessToken = require('./darajaAuth.js');
const stkPushURL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';


const stkPayment = async(args) => {
    // const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    // // console.log(timestamp);
    // let date = new Date();
    // let year = date.getFullYear();
    // let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    // let day = String(date.getDate()).padStart(2, '0');
    // let hours = String(date.getHours()).padStart(2, '0');
    // let minutes = String(date.getMinutes()).padStart(2, '0');
    // let seconds = String(date.getSeconds()).padStart(2, '0');
    // let formattedDate = year + month + day + hours + minutes + seconds;
    // // console.log(formattedDate);

    const requestData = {    
        "BusinessShortCode": process.env.BUSINESSSHORTCODE,    
        "Password": process.env.STKPASSWORD,    
        "Timestamp": "20160216165627",    
        // "Timestamp": formattedDate,    
        "TransactionType": "CustomerPayBillOnline",    
        "Amount": `${args.amount}`,        
        "PartyA": `${args.paymentNumber}`,    
        "PartyB": process.env.PARTYB,    
        "PhoneNumber": `${args.paymentNumber}`,    
        // "CallBackURL": `https://2cf1-129-222-187-168.ngrok-free.app/movies/reserve/confirmation`, 
        "CallBackURL": process.env.STKCALLBACK,   
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



