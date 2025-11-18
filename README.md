# Imagify

Imagify is a MERN-stack application that enables users to generate AI-based images from text prompts. It uses the ClipDrop API for image generation, follows a credit-based usage model, and supports credit purchases through Razorpay. The application includes secure authentication, a responsive interface, and a smooth user experience for generating and downloading AI images.

## Features

- AI image generation using ClipDrop API  
- 5 free credits provided to new users  
- 1 credit is consumed per generated image  
- Razorpay integration for purchasing additional credits  
- JWT-based authentication (Signup/Login)  
- Download option for generated images  
- Responsive UI built with Tailwind CSS  
- Organized frontend and backend architecture  

## Tech Stack

### Frontend
- React  
- Vite  
- Tailwind CSS  
- Custom CSS  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- JWT Authentication  

### APIs & Services
- ClipDrop Image Generation API  
- Razorpay Payment Gateway  

## Project Structure
project/
 ├── client/
 └── server/

## Installation
```bash
# Clone the repository
git clone https://github.com/username/project-name.git

##Frontend
# Start the client
cd client
npm install
npm run dev

##Backend
# Start the server
cd server
npm install
npm start



