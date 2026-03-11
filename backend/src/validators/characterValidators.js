const { body, validationResult } = require('express-validator');

const VALID_CLASSES = ['combatente', 'especialista', 'ocultista', 'sobrevivente'];
const VALID_ORIGINS = ['humano', 'criatura', 'espírito'];
const STAT_RANGE = { min: 1, max: 20 };
const NEX_RANGE = { min: 0, max: 300 };

const characterValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 1, max: 100 }).withMessage('Nome deve ter entre 1 e 100 caracteres'),

  body('class')
    .trim()
    .notEmpty().withMessage('Classe é obrigatória')
    .isIn(VALID_CLASSES).withMessage('Classe inválida'),

  body('nex')
    .isInt({ min: NEX_RANGE.min, max: NEX_RANGE.max })
    .withMessage(`NEX deve estar entre ${NEX_RANGE.min} e ${NEX_RANGE.max}`),

  body('origin')
    .optional()
    .trim()
    .isIn(VALID_ORIGINS).withMessage('Origem inválida'),

  body('subclass')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Subclasse deve ter no máximo 100 caracteres'),

  body('player_name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Nome do jogador deve ter no máximo 100 caracteres'),

  body('agi')
    .optional()
    .isInt(STAT_RANGE).withMessage(`Agilidade deve estar entre ${STAT_RANGE.min} e ${STAT_RANGE.max}`),

  body('for_')
    .optional()
    .isInt(STAT_RANGE).withMessage(`Força deve estar entre ${STAT_RANGE.min} e ${STAT_RANGE.max}`),

  body('int_')
    .optional()
    .isInt(STAT_RANGE).withMessage(`Inteligência deve estar entre ${STAT_RANGE.min} e ${STAT_RANGE.max}`),

  body('pre')
    .optional()
    .isInt(STAT_RANGE).withMessage(`Presença deve estar entre ${STAT_RANGE.min} e ${STAT_RANGE.max}`),

  body('vig')
    .optional()
    .isInt(STAT_RANGE).withMessage(`Vigor deve estar entre ${STAT_RANGE.min} e ${STAT_RANGE.max}`),

  body('use_pd')
    .optional()
    .isBoolean().withMessage('use_pd deve ser verdadeiro ou falso'),

  body('pv_max').optional().isInt({ min: 1 }).withMessage('PV máximo deve ser positivo'),
  body('pv_atual').optional().isInt({ min: 0 }).withMessage('PV atual não pode ser negativo'),
  body('pe_max').optional().isInt({ min: 1 }).withMessage('PE máximo deve ser positivo'),
  body('pe_atual').optional().isInt({ min: 0 }).withMessage('PE atual não pode ser negativo'),
  body('san_max').optional().isInt({ min: 1 }).withMessage('SAN máxima deve ser positiva'),
  body('san_atual').optional().isInt({ min: 0 }).withMessage('SAN atual não pode ser negativa'),
  body('pd_max').optional().isInt({ min: 1 }).withMessage('PD máximo deve ser positivo'),
  body('pd_atual').optional().isInt({ min: 0 }).withMessage('PD atual não pode ser negativo'),

  body('backstory').optional().isLength({ max: 10000 }).withMessage('Backstory muito longa'),
  body('personality').optional().isLength({ max: 5000 }).withMessage('Personalidade texto muito longa'),
  body('appearance').optional().isLength({ max: 5000 }).withMessage('Aparência texto muito longa'),
  body('motivations').optional().isLength({ max: 5000 }).withMessage('Motivações texto muito longa'),
  body('connections').optional().isLength({ max: 5000 }).withMessage('Conexões texto muito longa'),
  body('secrets').optional().isLength({ max: 5000 }).withMessage('Segredos texto muito longa'),
  body('notes').optional().isLength({ max: 10000 }).withMessage('Notas muito longas'),

  body('is_public')
    .optional()
    .isBoolean().withMessage('is_public deve ser verdadeiro ou falso'),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validação falhou',
      details: errors.array().map(e => ({ field: e.param, message: e.msg }))
    });
  }
  next();
};

module.exports = {
  characterValidators,
  validateRequest,
};
