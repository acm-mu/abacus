import { Router, Response, Request } from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { CompetitionSettings } from 'types';
import { contest } from "../contest";

const router = Router();

router.get("/contest", async (_, res: Response) => {
  try {
    const data = await contest.get_settings()
    res.send(data)
  } catch (err) {
    res.status(500).send(err)
  }
});

router.put('/contest',
  checkSchema({
    competition_name: {
      in: 'body',
      notEmpty: true,
      isString: true,
      errorMessage: 'String competition_name is not supplied'
    },
    points_per_yes: {
      in: 'body',
      notEmpty: true,
      isNumeric: true,
      errorMessage: 'Number points_per_yes is not supplied'
    },
    points_per_no: {
      in: 'body',
      notEmpty: true,
      isNumeric: true,
      errorMessage: 'Number points_per_no is not supplied'
    },
    points_per_minute: {
      in: 'body',
      notEmpty: true,
      isNumeric: true,
      errorMessage: 'Number points_per_minute is not supplied'
    },
    start_date: {
      in: 'body',
      notEmpty: true,
      isNumeric: true,
      errorMessage: 'Number start_date is not supplied'
    },
    end_date: {
      in: 'body',
      notEmpty: true,
      isNumeric: true,
      errorMessage: 'Number end_date is not supplied'
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array()
    if (errors.length > 0) {
      res.status(400).json({
        message: errors[0].msg
      })
      return
    }
    const settings = matchedData(req) as CompetitionSettings

    const startDate = new Date(settings.start_date * 1000)
    const endDate = new Date(settings.end_date * 1000)

    if (endDate <= startDate) {
      res.status(400).send({ message: "End date can not be before start date!" })
      return
    }

    contest.save_settings(settings)
      .then(_ => res.send(settings))
      .catch(err => res.status(400).send(err))
  })

export default router;
