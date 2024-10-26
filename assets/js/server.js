const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001; // You can change this to any port you prefer

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST endpoint to send email
app.post('/send', (req, res) => {
    const { fullname, email, message } = req.body;

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Your email
            pass: 'your-email-password', // Your email password or App Password
        },
    });

    // Email options
    const mailOptions = {
        from: email,
        to: 'aedamjung@gmail.com',
        subject: `Message from ${fullname}`,
        text: message,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Message sent successfully: ' + info.response);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
