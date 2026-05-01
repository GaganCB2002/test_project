const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const { auth, workspaceAccess } = require('../middlewares/auth');

router.post('/workspace/:workspaceId', auth, channelController.create);
router.get('/workspace/:workspaceId', auth, workspaceAccess, channelController.getWorkspaceChannels);
router.get('/:id', auth, channelController.getChannel);
router.put('/:id', auth, channelController.update);
router.post('/:id/members', auth, channelController.addMembers);
router.post('/workspace/:workspaceId/direct', auth, channelController.createDirectMessage);
router.get('/:id/messages', auth, channelController.getMessages);
router.post('/:id/messages', auth, channelController.sendMessage);
router.delete('/:id', auth, channelController.delete);

module.exports = router;