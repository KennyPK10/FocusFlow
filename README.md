# 🎯 FocusFlow

**FocusFlow** is a full-stack productivity web application that helps users manage their weekly schedules, track task progress with checkpoints, and stay focused with deep work sessions.

---

## Features

- Secure authentication with JWT and bcrypt
- Task creation with priority, estimated time, due date, and checkpoints
- Weekly calendar view to organize tasks by weekday
- Focus Mode to concentrate on one task at a time
- Progress tracking with dynamic visual indicators
- Backend protected with security best practices (Helmet, Rate Limiting, MongoDB Injection Protection)

---

## Tech Stack

**Frontend**  
- React.js  
- React Bootstrap  
- Axios  
- React Router DOM  

**Backend**  
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- JSON Web Tokens  
- bcrypt  
- express-validator  

---

## Security Measures
- Helmet for secure HTTP headers
- express-rate-limit to prevent brute-force attacks
- Input validation using express-validator
- Manual MongoDB key sanitization
- JWT tokens stored in HTTP-only cookies
- x-powered-by header disabled

---

## Author
- Pranav Kumar K
- GitHub: [KennyPK10/FocusFlow](https://github.com/KennyPK10/FocusFlow)
- Website Link: [Click Here](https://focus-flow-git-main-pranav-kumar-ks-projects.vercel.app)
