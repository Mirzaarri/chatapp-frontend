# Real-Time Chat Application

This is a real-time chat application built using React, TypeScript, Node.js, Express, Socket.IO, and MongoDB. The application allows users to send messages in real-time, supports chat history, and translates messages based on the user's preferred language.

## Features

- Real-time messaging using Socket.IO
- Message translation based on preferred language
- Chat history retrieval
- User authentication and authorization

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Yarn** (Package Manager)
- **MongoDB** (Running locally or via MongoDB Atlas)

### Project Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mirzaarri/chatapp-frontend.git
   cd chatapp-frontend
   ```

2. **Environment Variables**

- Create a .env file in the root directory.
- Copy the variables from .env.development into .env

3. **Install dependencies**

```typescript
  yarn install
```

4. **Running the backend server**

```typescript
  yarn dev
```

This will run the server at http://localhost:5173
