require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');
const catalogRoutes = require('./routes/catalog');
const { runSetup } = require('./db-setup');

const app = express();

app.set('trust proxy', 1);

// Segurança
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/catalog', catalogRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`OPRPG Tools API rodando na porta ${PORT}`);
  await runSetup(); // roda migrate + seed automaticamente
});