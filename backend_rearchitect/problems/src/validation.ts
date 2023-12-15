import { body, query } from "express-validator"

class Validation {

  static searchProblems = [
    query('division').isString().optional(),
  ]

  static createProblem = [
    body('id').isString().notEmpty().withMessage('Id cannot be empty'),
    body('division').isString().notEmpty().withMessage('Division cannot be empty'),
    body('name').isString().notEmpty().withMessage('Name cannot be empty'),
    body('memory_limit').optional().isString().withMessage('Memory limit must be a string'),
    body('cpu_time_limit').optional().isString().withMessage('Cpu time limit must be a string'),
    body('skeletons').optional().isArray().withMessage('Skeletons must be a list'),
    body('solutions').optional().isArray().withMessage('Solutions must be a list'),
    body('tests').optional().isArray().withMessage('Tests must be a list'),
    body('max_points').optional().isNumeric().withMessage('Max points must be a numeric'),
    body('capped_points').optional().isNumeric().withMessage('Capped points must be a numeric'),
    body('project_id').optional().isString().withMessage('Project Id must be a string')
  ]
}

export default Validation