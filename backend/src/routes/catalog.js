const express = require('express');
const { pool } = require('../config/db');
const { optionalAuth, requireSubscriber } = require('../middleware/auth');

const router = express.Router();

const secretFilter = (req) => {
  if (req.user?.isSubscriber) return '';
  return 'AND is_secret = FALSE';
};

// CRIATURAS
router.get('/creatures', optionalAuth, async (req, res) => {
  const { element, min_vd, max_vd, type, size, source, search } = req.query;
  const conditions = [`TRUE ${secretFilter(req)}`];
  const values = [];
  let idx = 1;
  if (element) { conditions.push(`element = $${idx++}`); values.push(element); }
  if (min_vd) { conditions.push(`vd >= $${idx++}`); values.push(parseInt(min_vd)); }
  if (max_vd) { conditions.push(`vd <= $${idx++}`); values.push(parseInt(max_vd)); }
  if (type) { conditions.push(`creature_type = $${idx++}`); values.push(type); }
  if (size) { conditions.push(`size = $${idx++}`); values.push(size); }
  if (source) { conditions.push(`source = $${idx++}`); values.push(source); }
  if (search) { conditions.push(`name ILIKE $${idx++}`); values.push(`%${search}%`); }
  const result = await pool.query(
    `SELECT id, slug, name, element, vd, size, creature_type, pv, defesa, source, is_secret
     FROM creatures WHERE ${conditions.join(' AND ')} ORDER BY vd ASC, name ASC`,
    values
  );
  res.json(result.rows);
});

router.get('/creatures/:slug', optionalAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM creatures WHERE slug = $1', [req.params.slug]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Criatura não encontrada' });
  const creature = result.rows[0];
  if (creature.is_secret && !req.user?.isSubscriber) return res.status(403).json({ error: 'Conteúdo exclusivo para assinantes' });
  res.json(creature);
});

// RITUAIS
router.get('/rituals', optionalAuth, async (req, res) => {
  const { element, circle, search } = req.query;
  const conditions = [`TRUE ${secretFilter(req)}`];
  const values = [];
  let idx = 1;
  if (element) { conditions.push(`(element = $${idx} OR element_secondary = $${idx++})`); values.push(element); }
  if (circle) { conditions.push(`circle = $${idx++}`); values.push(parseInt(circle)); }
  if (search) { conditions.push(`name ILIKE $${idx++}`); values.push(`%${search}%`); }
  const result = await pool.query(
    `SELECT id, slug, name, element, element_secondary, circle, execution, range, pe_cost, source
     FROM rituals WHERE ${conditions.join(' AND ')} ORDER BY element, circle, name`,
    values
  );
  res.json(result.rows);
});

router.get('/rituals/:slug', optionalAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM rituals WHERE slug = $1', [req.params.slug]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Ritual não encontrado' });
  const ritual = result.rows[0];
  if (ritual.is_secret && !req.user?.isSubscriber) return res.status(403).json({ error: 'Conteúdo exclusivo para assinantes' });
  res.json(ritual);
});

// ITENS
router.get('/items', optionalAuth, async (req, res) => {
  const { type, element, search } = req.query;
  const conditions = [`TRUE ${secretFilter(req)}`];
  const values = [];
  let idx = 1;
  if (type) { conditions.push(`item_type = $${idx++}`); values.push(type); }
  if (element) { conditions.push(`element = $${idx++}`); values.push(element); }
  if (search) { conditions.push(`name ILIKE $${idx++}`); values.push(`%${search}%`); }
  const result = await pool.query(
    `SELECT id, slug, name, item_type, element, curse_category, spaces, damage, critical, source
     FROM items WHERE ${conditions.join(' AND ')} ORDER BY item_type, name`,
    values
  );
  res.json(result.rows);
});

router.get('/items/:slug', optionalAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM items WHERE slug = $1', [req.params.slug]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Item não encontrado' });
  const item = result.rows[0];
  if (item.is_secret && !req.user?.isSubscriber) return res.status(403).json({ error: 'Conteúdo exclusivo para assinantes' });
  res.json(item);
});

// PODERES
router.get('/powers', optionalAuth, async (req, res) => {
  const { type, subclass, nex, search } = req.query;
  const conditions = [`TRUE ${secretFilter(req)}`];
  const values = [];
  let idx = 1;
  if (type) { conditions.push(`power_type = $${idx++}`); values.push(type); }
  if (subclass) { conditions.push(`(subclass = $${idx} OR subclass IS NULL)`); values.push(subclass); idx++; }
  if (nex) { conditions.push(`nex_required <= $${idx++}`); values.push(parseInt(nex)); }
  if (search) { conditions.push(`name ILIKE $${idx++}`); values.push(`%${search}%`); }
  const result = await pool.query(
    `SELECT id, slug, name, power_type, subclass, nex_required, source
     FROM powers WHERE ${conditions.join(' AND ')} ORDER BY power_type, nex_required, name`,
    values
  );
  res.json(result.rows);
});

router.get('/powers/:slug', optionalAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM powers WHERE slug = $1', [req.params.slug]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Poder não encontrado' });
  const power = result.rows[0];
  if (power.is_secret && !req.user?.isSubscriber) return res.status(403).json({ error: 'Conteúdo exclusivo para assinantes' });
  res.json(power);
});

// ORIGENS
router.get('/origins', optionalAuth, async (req, res) => {
  const secretClause = secretFilter(req);
  const result = await pool.query(
    `SELECT * FROM origins WHERE TRUE ${secretClause} ORDER BY name`
  );
  res.json(result.rows);
});

module.exports = router;