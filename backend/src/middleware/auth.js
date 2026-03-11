const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware opcional: não bloqueia, mas adiciona user se logado
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}
  }
  next();
};

// Exige que usuário seja assinante (acesso a Arquivos Secretos)
const requireSubscriber = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
  if (!req.user.isSubscriber) return res.status(403).json({ error: 'Conteúdo exclusivo para assinantes' });
  next();
};

module.exports = { auth, optionalAuth, requireSubscriber };