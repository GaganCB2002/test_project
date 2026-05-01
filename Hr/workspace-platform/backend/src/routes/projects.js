const express = require('express');
const projectController = require('../controllers/projectController');
const { auth, authorize, workspaceAccess } = require('../middlewares/auth');

const router = express.Router();

router.post('/workspace/:workspaceId', auth, workspaceAccess, projectController.create);
router.get('/workspace/:workspaceId', auth, projectController.getAll);
router.get('/:id', auth, projectController.getById);
router.put('/:id', auth, projectController.update);
router.post('/:id/members', auth, projectController.addMembers);
router.delete('/:id/members/:memberId', auth, projectController.removeMember);
router.delete('/:id', auth, projectController.delete);

module.exports = router;