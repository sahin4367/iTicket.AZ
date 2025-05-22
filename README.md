🎟️ iTicket - Online Ticket Sales Platform
This project allows users to easily order and pay for tickets to events (concerts, theater, etc.). The platform is built using TypeScript and Node.js (Express).

📌 Project Objective
Enable users to easily obtain event tickets.

Prevent others from claiming reserved tickets with a 15-minute hold period.

Enhance user experience with secure payment and email verification.

Manage events, tickets, and promo codes via the admin panel.

⚙️ Technologies Used
TypeScript

Node.js (Express)

MySQL (with TypeORM)

Nodemailer – for sending emails

CronJob – to automatically clear expired reservations

REST API – backend service

JWT – for authentication

PayPal (or fake payment) – for the payment process

🧩 Main Modules
👤 User Features
Registration

Login

Email Verification

Order and Payment History

🛒 Ticket & Order System
Event and Ticket models

Cart system (ticket selection and reservation)

PromoCode support

Order creation and payment process

15-minute reservation timer (managed with CronJob)

📧 Email System
Sending email verification codes

Sending confirmation messages after successful payments

📂 Project Folder Structure
iTicket/
│
├── .idea/                  
├── Client/               
├── node_modules/           
│
├── src/                   
│   ├── Core/              
│   │   ├── API/           
│   │   ├── app/           
│   │   ├── Jobs/           
│   │   └── Middlewares/    
│   │
│   ├── DAL/               
│   │   ├── config/       
│   │   └── models/         
│   │
│   ├── type/              
│   ├── consts.ts         
│   ├── helpers.ts         
│   ├── index.ts           
│   └── socket.ts          
│
├── uploads/           
│
├── .env                   
├── .env.example           
├── .gitignore             
├── package.json          
├── package-lock.json      
└── tsconfig.json          

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=****
DB_NAME=iticket
JWT_SECRET=****
USER_EMAIL=****@gmail.com
PASSWORD=****  # email göndərmək üçün


```bash
git clone https://github.com/sahin4367/iTicket.AZ
cd iticket-backend
npm install
npm run dev
