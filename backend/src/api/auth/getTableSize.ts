import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { contest } from '../../abacus'

export const schema: Record<string, ParamSchema> = {
  uid: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String uid is invalid'
  },
  display_name: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String display_name is not supplied'
  },
  school: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String school is invalid'
  },
  division: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String division is not supplied'
  },
  password: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String password is not supplied'
  },
  role: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String role is not supplied'
  },
  username: {
    in: ['body', 'query'],
    isString: true,
    optional: true,
    errorMessage: 'String username is not supplied'
  }
}

export const getTableSize = async (req: Request, res: Response) => {
  
  const tableName = req.query.tablename as string;
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }
  const params = matchedData(req)

  try {
    //makes call to db to get table size.
    const tableSize = await contest.get_table_size(tableName,params);
    //divides by the number of items per page.
    const pages = tableSize/5;
    //send response back.
    res.send({tableSize: pages});
  } catch (err) {
    res.sendStatus(500)
  }
}