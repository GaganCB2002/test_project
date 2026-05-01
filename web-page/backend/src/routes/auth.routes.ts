import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { authService } from '../services/auth.service'
import { activityService } from '../services/activity.service'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid email or password.' })
    return
  }

  try {
    const session = await authService.login(parsed.data.email, parsed.data.password)

    if (!session) {
      res.status(401).json({ message: 'Invalid email or password.' })
      return
    }

    activityService.log({
      title: 'User Login',
      detail: `Authenticated as ${session.user.email}`,
      category: 'Login',
      actor: session.user.name
    }, {
      ip: req.ip,
      device: req.headers['user-agent'],
      location: 'Bangalore, IN'
    })

    res.json(session)
  } catch (error) {
    res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed.' })
  }
})

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await authService.getUser(req.auth!.sub, req.auth)
    if (!user) {
      res.status(404).json({ message: 'User not found.' })
      return
    }
    res.json(user)
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
