const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  // Create Admin User
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  console.log('Admin user created:', admin.email);

  // Create Test User
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedUserPassword,
      name: 'Test User',
      role: 'USER'
    }
  });

  console.log('Test user created:', user.email);

  // Create Sample Products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      price: 199.99,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
    },
    {
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and GPS.',
      price: 299.99,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
    },
    {
      name: 'Laptop Stand',
      description: 'Ergonomic aluminum laptop stand for better posture and improved airflow.',
      price: 49.99,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with premium switches for gaming and typing.',
      price: 149.99,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop'
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
      price: 39.99,
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop'
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and more.',
      price: 59.99,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop'
    },
    {
      name: 'Portable Charger',
      description: '20000mAh portable charger with fast charging and dual USB ports.',
      price: 34.99,
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop'
    },
    {
      name: 'Phone Case',
      description: 'Durable protective phone case with shock absorption and sleek design.',
      price: 24.99,
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop'
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Waterproof Bluetooth speaker with 360° sound and 12-hour battery.',
      price: 79.99,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop'
    },
    {
      name: 'Webcam HD',
      description: '1080p HD webcam with auto-focus and built-in microphone for video calls.',
      price: 89.99,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop'
    },
    {
      name: 'Monitor 27"',
      description: '27-inch 4K monitor with IPS display and adjustable stand.',
      price: 399.99,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop'
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness and color temperature.',
      price: 44.99,
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop'
    }
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData
    });
    console.log(` Product created: ${product.name}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
