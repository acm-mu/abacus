import { Request, Response } from "express"
import { matchedData } from "express-validator"
import { User } from "./models"
import StandingsService from "./service"

class StandingsController {
  static async getStandingsByDivision(req: Request, res: Response): Promise<void> {
    try {
      const division = req.params.division
      const { sortBy, sortDirection, page, pageSize, ...filters } = matchedData(req)

      // check division against an Enum and return status codes if not a valid enum?

      const standings = await StandingsService.getStandingsByDivision(
        division, 
        {
          sortBy,
          sortDirection,
          page,
          pageSize,
          filters
        }
      )

      res.status(200).json(standings)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

export default StandingsController