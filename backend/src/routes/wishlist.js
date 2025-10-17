const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(wishlistItems);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add product to wishlist
router.post('/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId
      },
      include: {
        product: true
      }
    });

    res.status(201).json({
      message: 'Product added to wishlist',
      wishlistItem
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
});

// Remove product from wishlist
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    // Check if item exists in wishlist
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Product not in wishlist' });
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
});

module.exports = router;