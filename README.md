BACKEND SETUP INSTRUCTIONS
1. Initialize Backend

After creating the main project folder (Irapda LTD), run:

mkdir backend  
cd backend  
npm init -y  

2. Install Dependencies

Install all required backend dependencies:

npm install express prisma @prisma/client bcryptjs jsonwebtoken cors dotenv
npm install -D nodemon

3. Initialize Prisma
npx prisma init


This will create a prisma/ folder and a schema.prisma file for managing your database schema.

4. Update package.json Scripts

Open your package.json and replace the scripts section with:

"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js"
}

5. Create .env File

Create a .env file in the root of your backend folder.
This file stores environment variables such as database URLs, JWT secrets, and other sensitive information that should not be public.

Example:

DATABASE_URL="postgresql://user:password@localhost:5432/irapda"
JWT_SECRET="your_jwt_secret_here"
PORT=5000

6. Run Prisma Migrations

This step creates and applies database migrations, then generates the Prisma client code.

npx prisma migrate dev --name init
npx prisma generate

7. Create Admin User (Optional Seed Script)

Use this to seed (pre-fill) your database with initial data — such as admin and test users or sample products.

Steps:

Create a file named prisma/seed.js

Paste your seeding script inside it (the script that creates admin, users, and products).

Add this line to your package.json:

"prisma": {
  "seed": "node prisma/seed.js"
}


Run the seed command:

npx prisma db seed

🧩 FRONTEND SETUP INSTRUCTIONS
1. Create React + Vite App

Run the following commands to create and set up the frontend project:

npm create vite@latest frontend
cd frontend
npm install

2. Install Frontend Dependencies
npm install axios react-router-dom @tanstack/react-query zustand
npm install tailwindcss @tailwindcss/vite

3. Configure Tailwind CSS

Initialize Tailwind configuration:

npx tailwindcss init -p


Update your tailwind.config.js file to include:

content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
],


Add the Tailwind directives to your main CSS file (src/index.css or src/main.css):

@tailwind base;
@tailwind components;
@tailwind utilities;
