## BACKEND SETUP INSTRUCTIONS


**1. Initialize Backend:**  
    After creating the main project folder (Irapda LTD), run:

    mkdir backend  
    cd backend  
    npm init -y  

**2. Install Dependencies**  
    Install all required backend dependencies:

    npm install express prisma @prisma/client bcryptjs jsonwebtoken cors dotenv
    npm install -D nodemon


**3. Initialize Prisma**  

      npx prisma init

  This will create a prisma/ folder and a schema.prisma file for managing your database schema.


**4. Update package.json Scripts**  
  Open your package.json and replace the scripts section with:

    "scripts": {
      "dev": "nodemon src/server.js",
      "start": "node src/server.js"
    }


**5. Create .env File**  
  Create a .env file in the root of your backend folder.
  This file stores environment variables such as database URLs, JWT secrets, and other sensitive information that should not be public.

  For Example:
  
    DATABASE_URL="postgresql://user:password@localhost:5432/irapda"
    JWT_SECRET="your_jwt_secret_here"
    PORT=5000
  In this case, it's kept to avoid attackers using that information for malicious activities.  

  
**6. Run Prisma Migrations**
  This step creates and applies database migrations, then generates the Prisma client code.

    npx prisma migrate dev --name init
    npx prisma generate

**7. Create Admin User (Optional Seed Script)**  
  Use this to seed (pre-fill) your database with initial data; such as admin and test users or sample products.  
  Steps:

  i. Create a file named prisma/seed.js  
  ii. Paste your seeding script inside it (the script that creates admin, users, and products). 

  Add this line to your package.json:

    "prisma": {
      "seed": "node prisma/seed.js"
    }


  Run the seed command:  
  
    npx prisma db seed  





## FRONTEND SETUP INSTRUCTIONS

**1. Create React + Vite App**  
  Run the following commands to create and set up the frontend project:

    npm create vite@latest frontend
    cd frontend
    npm install

**2. Install Frontend Dependencies**  
  Make sure you install the following dependencies  
  
    npm install axios react-router-dom @tanstack/react-query zustand
    npm install tailwindcss @tailwindcss/vite

**3. Configure Tailwind CSS**  
  In your vite.config.ts file or vite.config.js file, include the following.  
  
    import tailwindcss from '@tailwindcss/vite'
    tailwindcss(),

  Add an @import to your CSS file that imports Tailwind CSS (src/index.css or src/main.css):  
  
    @import "tailwindcss";

**4. Create .env file**

```env
VITE_API_URL=http://localhost:5000/api
```

## RUNNING THE APPLICATION

**Backend**  
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000  


**Frontend**  
```bash
cd frontend
npm run dev
```

App runs on: http://localhost:5173

## API ENDPOINTS  
**Authentication**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user


**Products**  
- GET `/api/products` - Get all products (public)
- GET `/api/products/:id` - Get single product (public)
- POST `/api/products` - Create product (admin only)
- PUT `/api/products/:id` - Update product (admin only)
- DELETE `/api/products/:id` - Delete product (admin only)


### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:id` - Update cart item quantity
- DELETE `/api/cart/:id` - Remove item from cart


### Orders
- GET `/api/orders` - Get user's orders
- POST `/api/orders` - Place order from cart


### Wishlist
- GET `/api/wishlist` - Get user's wishlist
- POST `/api/wishlist/:productId` - Add to wishlist
- DELETE `/api/wishlist/:productId` - Remove from wishlist


## Testing Credentials

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Test User:**
Create via registration endpoint

## Next Steps

1. Set up database (PostgreSQL recommended)
2. Run backend migrations
3. Seed admin user
4. Start backend server
5. Start frontend development server
6. Test authentication flow
7. Implement remaining features

## Notes

- JWT tokens expire in 7 days (configurable)
- Passwords are hashed with bcrypt
- CORS enabled for frontend communication
- Role-based access control for admin routes
