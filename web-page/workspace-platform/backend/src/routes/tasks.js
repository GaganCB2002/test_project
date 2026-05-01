const express = require('express');
const taskController = require('../controllers/taskController');
const { auth, workspaceAccess } = require('../middlewares/auth');

const router = express.Router();

router.post('/project/:projectId', auth, taskController.create);
router.get('/project/:projectId', auth, taskController.getByProject);
router.get('/:id', auth, taskController.getById);
router.put('/:id', auth, taskController.update);
router.post('/:id/comments', auth, taskController.addComment);
router.post('/:id/attachments', auth, taskController.addAttachment);
router.post('/reorder', auth, taskController.reorder);
router.delete('/:id', auth, taskController.delete);

module.exports = router;