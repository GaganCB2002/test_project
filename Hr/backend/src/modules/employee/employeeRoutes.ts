import { Router } from 'express';
import { pgService } from '../../services/postgres.service';

const router = Router();

router.get('/my-leave', async (req, res) => {
  const { employeeId } = req.query;
  const requests = await pgService.getMyRequests(employeeId as string);
  res.json(requests);
});

router.post('/apply-leave', async (req, res) => {
  const leave = await pgService.applyLeave(req.body);
  res.json(leave);
});

export default router;
