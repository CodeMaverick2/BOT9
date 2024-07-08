# Chatbot Hotel Booking System

This is a chatbot-based hotel booking system built with Node.js, Express, Sequelize (SQLite), OpenAI, and Nodemailer. The chatbot assists users in booking hotel rooms by providing available room options and sending booking confirmation emails.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

To set up and run this project locally, follow these steps:

### 1. Clone the Repository
Clone the repository to your local machine using the following command:
```bash
git clone https://github.com/CodeMaverick2/BOT9.git
```

### 2. Navigate to the Project Directory
```bash
cd BOT9
```

### 3. Install Dependencies
Install the necessary dependencies using npm:
```bash
npm install dotenv express nodemailer nodemon openai sequelize sqlite3 validator
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory of the project and add the necessary environment variables. Here is an example `.env` file:

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tejasghatule12345@gmail.com
SMTP_PASS=ypjx sazh xoeu ntaw
FROM_EMAIL=tejasghatule12345@gmail.com
OPENAI_API_KEY=your-openai-api-key
```

Replace the placeholder values with your actual configuration.

## Usage

### 1. Start the Server
Start the server in development mode:
```bash
npm run dev
```
The server will be running on `http://localhost:3000`.

### 2. Access the Application
Open your web browser and navigate to `http://localhost:3000` to interact with the chatbot.

## Environment Variables

The following environment variables need to be set in the `.env` file:

- `PORT`: The port number on which the server will run.
- `SMTP_HOST`: The SMTP host for sending emails (e.g., `smtp.gmail.com`).
- `SMTP_PORT`: The SMTP port for sending emails (e.g., `587`).
- `SMTP_SECURE`: Whether to use secure SMTP (true/false).
- `SMTP_USER`: The SMTP user for sending emails (e.g., `tejasghatule12345@gmail.com`).
- `SMTP_PASS`: The SMTP password for sending emails.
- `FROM_EMAIL`: The email address from which booking confirmation emails will be sent (e.g., `tejasghatule12345@gmail.com`).
- `OPENAI_API_KEY`: Your OpenAI API key.

## Endpoints

### POST /chat
Handles the chatbot interactions.

#### Request Body
```json
{
  "message": "User's message",
  "userId": "Unique user identifier"
}
```

#### Response
```json
{
  "response": "Chatbot's response"
}
```

## Dependencies

To install the required dependencies, run the following command:
```bash
npm install dotenv express nodemailer nodemon openai sequelize sqlite3 validator
```

List of dependencies:
- **dotenv**: ^16.4.5
- **express**: ^4.19.2
- **nodemailer**: ^6.9.14
- **nodemon**: ^3.1.4
- **openai**: ^4.52.3
- **sequelize**: ^6.37.3
- **sqlite3**: ^5.1.7
- **validator**: ^13.12.0

## License

This project is licensed under the ISC License.
