const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { matchedData, validationResult, checkSchema } = require('express-validator')
const { DynamoDB: { Converter: { marshall } } } = require('aws-sdk')
const { handler } = require('../PistonRunner/PistonRunner')

const PORT = process.env.PORT || 6000

const app = express()
const server = createServer(app)

app.use(cors())
app.use(express.json())

const schema = {
  sid: { in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'sid is not supplied'
  },
  pid: { in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  },
  division: { in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'division is not supplied'
  },
  // TODO: LANGUAGE
  language: { in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'language is not supplied'
  },
  source: { in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'source is not supplied'
  },
  date: { in: 'body',
    isNumeric: true,
    notEmpty: true,
    errorMessage: 'date is not supplied'
  },
  sub_no: { in: 'body',
    isNumeric: true,
    notEmpty: true,
    errorMessage: 'sub_no is not supplied'
  }
}

app.post('/execute', checkSchema(schema), async(req, res) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)

  // Mock AWS DynamoDB PUT -> Lambda Trigger
  res.send(await handler({
    Records: [{
      eventName: 'INSERT',
      dynamodb: {
        NewImage: marshall(item)
      }
    }]
  }))
})

server.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`)
})