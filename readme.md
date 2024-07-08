# Simplified Hotel Booking Chatbot

This project aims to develop a RESTful API using Express.js to power a chatbot capable of handling hotel booking queries. The chatbot leverages OpenAI's API for natural language processing to understand and respond to user queries effectively. It also maintains a conversation history to provide a seamless user experience throughout the booking process.

## Objective

To create a chatbot that can handle queries related to booking hotel rooms, providing a list of options, pricing information, and booking confirmation through a RESTful API.

## Technical Requirements

1. **Express.js**: The server framework used to build the API.
2. **OpenAI API**: For processing natural language queries and generating responses.
3. **SQLite & Sequelize**: For storing conversation history and booking details.
4. **Function Calling**: To fetch room data and simulate booking processes.

## Main Endpoint

- `POST /chat`: Receives user messages and returns chatbot responses.

## Chatbot Flow

1. **Initiation**: User starts a conversation about booking a room.
2. **Room Options**: The bot fetches and presents room options.
3. **Selection**: User selects a preferred room.
4. **Pricing Information**: Bot provides the cost details.
5. **Booking Confirmation**: User agrees to book, and the bot simulates booking the room, returning a confirmation ID.

## Skills Tested

- Building a RESTful API with Express.js.
- Integrating OpenAI's API for natural language understanding.
- Maintaining conversation history.
- Simulating external API interactions for room bookings.

## Bonus Features

- Basic error handling for unexpected user inputs or API errors.
- A simple frontend interface for interacting with the chatbot.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your_username/hotel-booking-chatbot.git

