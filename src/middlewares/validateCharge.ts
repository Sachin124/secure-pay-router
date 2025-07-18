import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const chargeSchema = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  source: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const validateCharge = (req: Request, res: Response, next: NextFunction) => {
  console.log('Validating charge request:', req.body);
  const { error } = chargeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
}; 