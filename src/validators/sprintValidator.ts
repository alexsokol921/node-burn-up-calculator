import { Request, Response, NextFunction } from 'express';
import { validationResult, check } from 'express-validator';

export const validateGetSprints = [
  check('page').optional().isInt(),
  check('pageSize').optional().isInt(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateGetSprintsByTeam = [
  check('teamId').isInt(),
  check('page').optional().isInt(),
  check('pageSize').optional().isInt(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateGetVelocityByTeam = [
  check('teamId').isInt(),
  check('sampleSize').isInt(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateCreateSprint = [
  check('teamId').isInt(),
  check('effortCompleted').isInt(),
  check('milestoneTotalEffort').isInt(),
  check('sprintEndDate').isISO8601(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateSprint = [
  check('id').isInt(),
  check('teamId').isInt(),
  check('effortCompleted').isInt(),
  check('milestoneTotalEffort').isInt(),
  check('sprintEndDate').isISO8601(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateDeleteSprint = [
  check('id').isInt(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
