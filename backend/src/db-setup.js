const { pool } = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runSetup() {
  const client = await pool.connect();
  try {
    // Verifica se o banco já foi populado
    const check = await client.query(
      `SELECT COUNT(*) FROM creatures`
    ).catch(() => ({ rows: [{ count: '0' }] }));

    const count = parseInt(check.rows[0].count);

    // Roda migrate sempre (IF NOT EXISTS é seguro)
    console.log('[db-setup] Rodando migrate.sql...');
    const migrate = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');
    await client.query(migrate);
    console.log('[db-setup] migrate.sql OK');

    // Roda seed só se o banco estiver vazio
    if (count === 0) {
      console.log('[db-setup] Banco vazio — rodando seed.sql...');
      const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
      await client.query(seed);
      console.log('[db-setup] seed.sql OK — banco populado!');
    } else {
      console.log(`[db-setup] Banco já tem ${count} criaturas — seed ignorado.`);
    }
  } catch (err) {
    console.error('[db-setup] Erro:', err.message);
    // Não derruba o servidor por falha de setup
  } finally {
    client.release();
  }
}

module.exports = { runSetup };