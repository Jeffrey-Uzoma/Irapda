const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    next();
  } catch (err) {
    console.error('Role check error:', err);
    res.status(500).json({ error: 'Server error in role check' });
  }
};

module.exports = { isAdmin };
