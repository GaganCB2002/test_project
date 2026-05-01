import { Router } from 'express';
import { pgService } from '../../services/postgres.service';

const router = Router();

router.get('/dashboard', async (req, res) => {
  // Logic specific to HR Dashboard
  res.json({ message: "HR Dashboard Intel" });
});

router.get('/leave-requests', async (req, res) => {
  const requests = await pgService.getAllRequests();
  res.json(requests);
});

export default router;
