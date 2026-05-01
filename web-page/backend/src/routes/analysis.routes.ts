import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { authenticate } from '../middleware/auth'
import { db } from '../services/db.service'

const router = Router()
const README_PATH = path.join(__dirname, '../../../techlead-analysis/README.md')

// Read README.md content
router.get('/readme', authenticate, (req, res) => {
  try {
    if (fs.existsSync(README_PATH)) {
      const content = fs.readFileSync(README_PATH, 'utf-8')
      res.json({ content })
    } else {
      res.status(404).json({ message: 'README.md not found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading file.' })
  }
})

// Get analysis records
router.get('/records', authenticate, (req, res) => {
  const data = db.get().analysis || []
  res.json(data)
})

// Create/Update analysis and sync README
router.post('/records', authenticate, (req, res) => {
  const { title, developer, status, timeSpent, quality } = req.body
  
  if (!title || !developer) {
    res.status(400).json({ message: 'Missing required fields.' })
    return
  }

  const newRecord = {
    id: `anl-${Date.now()}`,
    title,
    developer,
    status,
    timeSpent,
    quality,
    timestamp: new Date().toISOString()
  }

  db.update((current) => {
    if (!current.analysis) current.analysis = []
    current.analysis.unshift(newRecord)
  })

  // Dynamic README update logic
  try {
    let readmeContent = fs.readFileSync(README_PATH, 'utf-8')
    
    // Find the Task Performance table section and append
    const tableHeader = '| Task ID | Developer | Status | Time Spent | Quality |'
    const newRow = `| ${newRecord.id} | ${developer} | ${status} | ${timeSpent} | ${quality} |`
    
    if (readmeContent.includes(tableHeader)) {
      const lines = readmeContent.split('\n')
      const tableIndex = lines.findIndex(line => line.includes(tableHeader))
      // Add after the header and separator
      lines.splice(tableIndex + 2, 0, newRow)
      readmeContent = lines.join('\n')
    }

    fs.writeFileSync(README_PATH, readmeContent, 'utf-8')
  } catch (error) {
    console.error('Failed to sync README:', error)
  }

  res.json(newRecord)
})

export default router
