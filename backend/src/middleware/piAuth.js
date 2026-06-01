const piAuth = (req, res, next) => {
  const piAddress = req.headers['x-pi-address'];
  const piSignature = req.headers['x-pi-signature'];

  if (!piAddress || !piSignature) {
    return res.status(401).json({ error: 'Pi authentication required' });
  }

  req.piAddress = piAddress;
  req.piSignature = piSignature;
  next();
};

module.exports = piAuth;
