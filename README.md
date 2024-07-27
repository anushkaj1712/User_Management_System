User Management System

This project provides a comprehensive user management system with functionalities for user registration, OTP verification, login, password management, and profile picture handling. Built with Node.js and Express.js, it ensures secure and efficient user operations.

Table of Contents

- Features
- Technologies
- Endpoints
- Setup
- Usage
- API Documentation
- Contributing
- License


Features

User Registration:

- Sign up with email verification via OTP
- Resend OTP
- Verify OTP
  
Authentication:

- Login with email and password
  
Password Management:

- Change password
- Forgot password with OTP verification
- Reset password

Profile Management:

- Upload profile picture
- Update profile picture


Technologies
- Node.js
- Express.js
- MongoDB (or any other database)
- JWT (JSON Web Token) for authentication
- Multer for file uploads


Endpoints

User Registration:

- Create a new user and send OTP
- Verify OTP for email confirmation
- Resend OTP for email verification


Authentication:

- Login with email and password

Password Management:

- Change user password
- Request OTP for password reset
- Reset password using OTP

Profile Management:

- Upload a new profile picture
- Update existing profile picture

Setup
1. Clone the repository and navigate to the project directory.
2. Install dependencies using npm install.
3. Set up environment variables in a .env file.
4. Start the server using npm start.

Usage
1. Ensure the server is running.
2. Use API endpoints to manage user registration, authentication, password management, and profile operations. Tools like Postman or Curl can be used for testing the API endpoints.

   
API Documentation
- Detailed API documentation covers the endpoints for user registration, OTP verification, login, password management, and profile picture handling, including request and response formats.

Contributing

Contributions are welcome! Please follow these steps to contribute:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Commit your changes.
- Push your branch to your forked repository.
- Open a pull request to the main repository.


License
- This project is licensed under the MIT License - see the LICENSE file for details.
