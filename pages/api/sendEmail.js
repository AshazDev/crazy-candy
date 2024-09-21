// /pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function sendEmail(req, res) {
  if (req.method === 'POST') {
    const { name, email, total, items } = req.body;

    const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.mail.me.com",
      auth: {
        user: process.env.EMAIL_USER, // Set your email in environment variables
        pass: process.env.EMAIL_PASS, // Set your email password in environment variables
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send the email to the client's email
      subject: 'Order Confirmation',
      html: `
        <h2>Thank you for your order, ${name}!</h2>
        <p>We have received your order and are processing it. Here are the details:</p>
        <h3>Order Summary:</h3>
        <ul>
          ${items.map(item => `<li>${item.name} - ${item.quantity} x BD${item.price}</li>`).join('')}
        </ul>
        <h4>Total: BD${total.toFixed(2)}</h4>
        <p>We will contact you once your order is ready.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
