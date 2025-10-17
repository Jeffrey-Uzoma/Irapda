**BACKEND SETUP INSTRUCTIONS**

**1. Initialize Backend**: 
  Run the following commands after creating the Irapda LTD file;

  mkdir backend
  cd backend
  npm init -y


**2. Install Dependencies**: 
  Run the following code to install the backend dependencies
  
  npm install express prisma @prisma/client bcryptjs jsonwebtoken cors dotenv
  npm install -D nodemon


**3. Initialize Prisma**
   npx prisma init


  **4. Update package.json scripts**
    "scripts": {
      "dev": "nodemon src/server.js",
      "start": "node src/server.js"
    }



 **5. Create .env file**
     This file stores all the vital information and codes to be hidden from the public eye


 **6. Run Migrations**
    This Creates & applies a database migration based on schema changes, then the second one Generates the Prisma Client code
    npx prisma migrate dev --name init
    npx prisma generate


**7. Create Admin User (Optional Seed)**
      This is where I keep script used to pre-fill your database with initial or sample data

      NB: After doing this, You update your packege.json file and run this code.
      Add to package.json:

      "prisma": {
        "seed": "node prisma/seed.js"
      }
      
      npx prisma db seed


      **FRONTEND SETUP INSTRUCTIONS**

**1. Create React + Vite App**
      Run this to create and install all dependencies
      
      npm create vite@latest frontend
      cd frontend
      npm install


**2. Install Dependencies**
npm install axios react-router-dom @tanstack/react-query zustand
npm install tailwindcss @tailwindcss/vite


3. Configure Tailwind CSS
