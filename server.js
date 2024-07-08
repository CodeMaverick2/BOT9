require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const OpenAI = require('openai');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Log environment variables (excluding sensitive information)
console.log('Environment variables:', {
  SMTP_HOST: process.env.SMTP_HOST ? 'Set' : 'Not set',
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Not set',
  FROM_EMAIL: process.env.FROM_EMAIL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set'
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Define Conversation model
const Conversation = sequelize.define('Conversation', {
  userId: DataTypes.STRING,
  messages: DataTypes.TEXT
});

// Sync database
sequelize.sync();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Function to send email
async function sendBookingConfirmationEmail(booking) {
  const msg = {
    from: process.env.FROM_EMAIL,
    to: booking.email,
    subject: 'Your Hotel Booking Confirmation',
    text: `Dear ${booking.fullName},

Great news! 🎉 Your hotel room booking has been successfully confirmed.

Booking Details:
🔑 Booking ID: ${booking.bookingId}
🏠 Room ID: ${booking.roomId}
📅 Number of nights: ${booking.nights}

We're thrilled to have you as our guest. Here's what you can expect:
- A comfortable stay in your chosen room
- Access to all our hotel amenities
- 24/7 customer service to assist you during your stay

Important Information:
- Check-in time: 3:00 PM
- Check-out time: 11:00 AM
- Please bring a valid ID and the credit card used for booking

If you need to make any changes to your reservation or have any questions, please don't hesitate to contact us at our front desk number: +1 (555) 123-4567.

We look forward to welcoming you and ensuring you have a wonderful stay with us!

Best regards,
The Hotel Booking Team

P.S. Don't forget to check our website for special offers on dining and spa services during your stay!`
  };

  try {
    console.log('Attempting to send email to:', booking.email);
    const info = await transporter.sendMail(msg);
    console.log('Email sent successfully. MessageId:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

app.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    let conversation = await Conversation.findOne({ where: { userId } });
    if (!conversation) {
      conversation = await Conversation.create({ userId, messages: '[]' });
    }
    
    let messages = JSON.parse(conversation.messages);
    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for hotel bookings. When booking a room, collect all necessary information before calling the book_room function. Do not ask for information multiple times use emojis to be friendly." },
        ...messages
      ],
      functions: [
        {
          name: "get_room_options",
          description: "Get available room options",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "book_room",
          description: "Book a room",
          parameters: {
            type: "object",
            properties: {
              roomId: { type: "integer" },
              fullName: { type: "string" },
              email: { type: "string" },
              nights: { type: "integer" }
            },
            required: ["roomId", "fullName", "email", "nights"]
          }
        }
      ],
      function_call: "auto"
    });

    const assistantMessage = completion.choices[0].message;

    if (assistantMessage.function_call) {
      const functionName = assistantMessage.function_call.name;
      const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

      let functionResult;
      if (functionName === 'get_room_options') {
        functionResult = await getRoomOptions();
      } else if (functionName === 'book_room') {
        try {
          functionResult = await bookRoom(functionArgs);
          const emailSent = await sendBookingConfirmationEmail(functionResult);
          console.log('Email sending result:', emailSent);
          functionResult = { ...functionResult, emailSent };
        } catch (error) {
          console.error('Error in booking process:', error);
          functionResult = { error: 'An error occurred during the booking process.' };
        }
      }

      messages.push(assistantMessage);
      messages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResult)
      });

      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for hotel bookings. When a room is successfully booked, provide a clear confirmation message including all booking details from the API response." },
          ...messages
        ]
      });

      messages.push(secondCompletion.choices[0].message);
    } else {
      messages.push(assistantMessage);
    }

    await conversation.update({ messages: JSON.stringify(messages) });

    res.json({ response: messages[messages.length - 1].content });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

async function getRoomOptions() {
  try {
    const response = await fetch('https://bot9assignement.deno.dev/rooms');
    return await response.json();
  } catch (error) {
    console.error('Error getting room options:', error);
    throw error;
  }
}

async function bookRoom(args) {
  try {
    const response = await fetch('https://bot9assignement.deno.dev/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    const bookingResult = await response.json();
    
    return {
      ...bookingResult,
      bookingId: bookingResult.bookingId, // Ensure this is returned from the API
      roomId: args.roomId,
      fullName: args.fullName,
      email: args.email,
      nights: args.nights
    };
  } catch (error) {
    console.error('Error booking room:', error);
    throw error;
  }
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});