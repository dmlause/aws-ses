const aws = require('aws-sdk');
const express = require('express');
const dotenv = require('dotenv');
const port = process.env.PORT || 3001;

var app = express();

// Load the environment variables from .env
dotenv.load();

// Configure AWS
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-2'
});

app.get('/send-email', (req, res) => {

    // Set the params for sending an email
    const params = {
        Destination: {
            ToAddresses: ['contactdlause@gmail.com']
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: req.query.subject,
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: req.query.body,
            }
        },
        Source: 'contactdlause@gmail.com',
    };

    const sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    // Send the Email
    sendPromise.then(() => {
        res.status(200).json({responseText: 'Email sent successfully.'});
    }).catch((error) => {
        res.status(500).json(
            {
                responseText: 'Email did not send.',
                error: error.stack,
            });
    });
});

app.listen(port, () => {
    console.log("Contact-Page Email Server listening on port " + port + "...");
});