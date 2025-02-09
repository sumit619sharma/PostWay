## Mini Project-Postaway-II 
   - Problem Statement https://classroom.codingninjas.com/app/classroom/me/25432/content/694562/offering/11358488


# Postaway-II: Social Media Backend API

## Objective
Develop a robust social media backend REST API using Node.js, Express.js, and MongoDB, allowing users to create posts, comment, like, send friend requests, and reset passwords using OTP authentication.

## Features
- **User Authentication**: Signup, login, logout, and logout from all devices.
- **Post Management**: CRUD operations for posts with captions and image URLs.
- **Comment System**: Add, update, and delete comments on posts.
- **Like Functionality**: Toggle likes on posts and comments.
- **Friendship Features**: Manage friendships, pending requests, and friend acceptance.
- **User Profile Management**: Update user details and avatar uploads.
- **OTP-Based Password Reset**: Secure password reset using OTP.
- **RESTful API Design**: Organized routes and controllers for scalability.

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Email Services**: Nodemailer (for OTP management)
- **File Upload**: Multer (for avatar and post images)
- **Environment Variables**: dotenv
- **Logging & Error Handling**: Winston, Express middleware

---

## Installation & Setup
### 1. Clone the Repository
```sh
git clone https://github.com/satyam-software-developer/postaway-II.git
cd postaway-ii
```
### 2. Install Dependencies
```sh
npm install
```
### 3. Setup Environment Variables
Create a `.env` file and add the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
### 4. Start the Server
```sh
npm start
```
Server will be running on `http://localhost:3000`

---

## API Endpoints

### Authentication Routes
- `POST /api/users/signup` - Register a new user
- `POST /api/users/signin` - Log in
- `POST /api/users/logout` - Log out
- `POST /api/users/logout-all-devices` - Log out from all devices

### User Profile Routes
- `GET /api/users/get-details/:userId` - Get user details
- `GET /api/users/get-all-details` - Get all users
- `PUT /api/users/update-details/:userId` - Update user details

### Post Routes
- `GET /api/posts/all` - Get all posts (news feed)
- `GET /api/posts/:postId` - Get a specific post
- `POST /api/posts/` - Create a new post
- `PUT /api/posts/:postId` - Update a post
- `DELETE /api/posts/:postId` - Delete a post

### Comment Routes
- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments/:postId` - Add a comment
- `PUT /api/comments/:commentId` - Update a comment
- `DELETE /api/comments/:commentId` - Delete a comment

### Like Routes
- `GET /api/likes/:id` - Get likes for a post or comment
- `POST /api/likes/toggle/:id` - Toggle like

### Friendship Routes
- `GET /api/friends/get-friends/:userId` - Get user's friends
- `GET /api/friends/get-pending-requests` - Get pending friend requests
- `POST /api/friends/toggle-friendship/:friendId` - Send/remove a friend request
- `POST /api/friends/response-to-request/:friendId` - Accept/reject a friend request

### OTP Routes
- `POST /api/otp/send` - Send OTP for password reset
- `POST /api/otp/verify` - Verify OTP
- `POST /api/otp/reset-password` - Reset password

---

## Error Handling & Logging
- **Middleware-based error handling** ensures proper API responses.
- **Logging** is handled using Winston for better debugging.

---

## Testing & Documentation
- **Testing**: The API can be tested using Postman.
- **Documentation**: Postman collection available for testing.

**Postman Collection Link**: _[Provide URL Here]_  

Follow these steps:
1. Open the link.
2. Log in to Postman.
3. Fork the collection and test your API.

---

## Future Enhancements
- Real-time notifications for likes, comments, and friend requests using WebSockets.
- Implement GraphQL for more efficient querying.
- Enhance security with rate-limiting and IP-based authentication.

---

## Contributing
Feel free to contribute to this project by submitting issues and pull requests.

---

## License
This project is licensed under the MIT License.

---

---
**Postaway-II** is a scalable social media backend that provides a seamless user experience. Happy coding!
