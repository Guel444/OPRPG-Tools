const express = require('express');
const { pool } = require('../config/db');
const { auth, optionalAuth } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// GET /api/characters — listar fichas do usuário
router.get('/', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT id, name, class, nex, origin, subclass, use_pd,
       pv_atual, pv_max, pe_atual, pe_max, san_atual, san_max, pd_atual, pd_max,
       updated_at
     FROM characters WHERE user_id = $1 ORDER BY updated_at DESC`,
    [req.user.id]
  );
  res.json(result.rows);
});

// GET /api/characters/share/:token — acesso público por link (deve vir ANTES de /:id)
router.get('/share/:token', async (req, res) => {
  const result = await pool.query('SELECT * FROM characters WHERE share_token = $1', [req.params.token]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Ficha não encontrada' });
  res.json(result.rows[0]);
});

// GET /api/characters/:id — buscar ficha específica
router.get('/:id', optionalAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM characters WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Ficha não encontrada' });
  const char = result.rows[0];
  if (!char.is_public && (!req.user || req.user.id !== char.user_id))
    return res.status(403).json({ error: 'Acesso negado' });
  res.json(char);
});

// POST /api/characters — criar nova ficha
router.post('/', auth, async (req, res) => {
  const {
    name, class: cls, nex, origin, subclass, player_name,
    agi = 1, for_ = 1, int_ = 1, pre = 1, vig = 1,
    use_pd = false,
    backstory, personality, appearance, motivations, connections, secrets, notes,
    trait_brave, trait_curious, trait_skeptic, trait_pragmatic,
    trait_empath, trait_lone_wolf, trait_leader, trait_haunted,
  } = req.body;

  const shareToken = crypto.randomBytes(16).toString('hex');
  const d = calculateDerived({ class: cls, nex, agi, for_, int_, pre, vig, use_pd });

  try {
    const result = await pool.query(
      `INSERT INTO characters (
         user_id, name, class, nex, origin, subclass, player_name, use_pd,
         agi, for_, int_, pre, vig,
         pv_max, pv_atual,
         pe_max, pe_atual,
         san_max, san_atual,
         pd_max, pd_atual,
         defesa, share_token,
         backstory, personality, appearance, motivations, connections, secrets, notes,
         trait_brave, trait_curious, trait_skeptic, trait_pragmatic,
         trait_empath, trait_lone_wolf, trait_leader, trait_haunted
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,
         $9,$10,$11,$12,$13,
         $14,$14,
         $15,$15,
         $16,$16,
         $17,$17,
         $18,$19,
         $20,$21,$22,$23,$24,$25,$26,
         $27,$28,$29,$30,$31,$32,$33,$34
       ) RETURNING *`,
      [
        req.user.id, name, cls, nex, origin, subclass || null, player_name || null, use_pd,
        agi, for_, int_, pre, vig,
        d.pvMax,
        d.peMax,
        d.sanMax,
        d.pdMax,
        d.defesa, shareToken,
        backstory || null, personality || null, appearance || null,
        motivations || null, connections || null, secrets || null, notes || null,
        !!trait_brave, !!trait_curious, !!trait_skeptic, !!trait_pragmatic,
        !!trait_empath, !!trait_lone_wolf, !!trait_leader, !!trait_haunted,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar ficha' });
  }
});

// PUT /api/characters/:id — atualizar ficha
router.put('/:id', auth, async (req, res) => {
  const charResult = await pool.query('SELECT user_id FROM characters WHERE id = $1', [req.params.id]);
  if (charResult.rows.length === 0) return res.status(404).json({ error: 'Ficha não encontrada' });
  if (charResult.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });

  const allowedFields = [
    'name','nex','origin','subclass','player_name','use_pd',
    'agi','for_','int_','pre','vig',
    'pv_max','pv_atual','pe_max','pe_atual','san_max','san_atual',
    'pd_max','pd_atual',
    'defesa','prestige',
    'skills','powers','rituals','equipment','conditions',
    'notes','backstory','personality','appearance','motivations','connections','secrets',
    'trait_brave','trait_curious','trait_skeptic','trait_pragmatic',
    'trait_empath','trait_lone_wolf','trait_leader','trait_haunted',
    'is_public',
  ];

  const updates = [];
  const values = [];
  let idx = 1;
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates.push(`${key} = $${idx}`);
      values.push(typeof req.body[key] === 'object' && req.body[key] !== null
        ? JSON.stringify(req.body[key])
        : req.body[key]);
      idx++;
    }
  }
  if (updates.length === 0) return res.status(400).json({ error: 'Nenhum campo para atualizar' });

  values.push(req.params.id);
  const result = await pool.query(
    `UPDATE characters SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
    values
  );
  res.json(result.rows[0]);
});

// DELETE /api/characters/:id
router.delete('/:id', auth, async (req, res) => {
  const charResult = await pool.query('SELECT user_id FROM characters WHERE id = $1', [req.params.id]);
  if (charResult.rows.length === 0) return res.status(404).json({ error: 'Ficha não encontrada' });
  if (charResult.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });
  await pool.query('DELETE FROM characters WHERE id = $1', [req.params.id]);
  res.json({ message: 'Ficha deletada' });
});

// Cálculo de derivadas (espelha o frontend)
function calculateDerived({ class: cls, nex, agi = 1, for_ = 1, int_ = 1, pre = 1, vig = 1, use_pd = false }) {
  const stage = Math.max(1, Math.floor(nex / 5));
  const extra = stage - 1;
  const configs = {
    combatente:  { pvBase: 20, pvPS: 4, peBase: 2, pePS: 2, sanBase: 12, sanPS: 3, pdBase: 6,  pdPS: 3 },
    especialista:{ pvBase: 16, pvPS: 3, peBase: 3, pePS: 3, sanBase: 16, sanPS: 4, pdBase: 8,  pdPS: 4 },
    ocultista:   { pvBase: 12, pvPS: 2, peBase: 4, pePS: 4, sanBase: 20, sanPS: 5, pdBase: 10, pdPS: 5 },
    sobrevivente:{ pvBase: 10, pvPS: 2, peBase: 2, pePS: 1, sanBase: 8,  sanPS: 2, pdBase: 4,  pdPS: 2 },
  };
  const c = configs[cls] || configs.combatente;
  const pvMax  = Math.max(1, c.pvBase + vig + (c.pvPS + vig) * extra);
  const peMax  = Math.max(1, c.peBase + pre + (c.pePS + pre) * extra);
  const sanMax = Math.max(1, c.sanBase + c.sanPS * extra);
  const pdMax  = Math.max(1, c.pdBase + pre + (c.pdPS + pre) * extra);
  const defesa = 10 + agi;
  return { pvMax, peMax, sanMax, pdMax, defesa };
}

module.exports = router;