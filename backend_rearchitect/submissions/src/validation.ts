import { query } from "express-validator"

class Validation {
  static base = [
    query('sortBy').isString().optional(),
    query('sortDirection').isString().isIn(['ascending', 'descending']).optional(),
    query('page').isNumeric().optional(),
    query('pageSize').isNumeric().optional(),
  ]
}

export default Validation