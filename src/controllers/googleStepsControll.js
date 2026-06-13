import { getCurrentSteps } from "../services/googleStepsService.js";

export const getCurrentStepsControll =  async (req, res) => {
    console.log(req.query.steps_date)
    const result = await getCurrentSteps(req.user.userId, req.query.steps_date)
    

    console.log('ШАГИ:', result)
}