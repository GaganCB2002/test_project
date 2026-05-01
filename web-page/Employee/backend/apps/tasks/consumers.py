import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class TaskUpdateConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time task updates."""

    async def connect(self):
        """Handle WebSocket connection."""
        self.user = await self.get_user_from_token()

        if self.user:
            await self.channel_layer.group_add(
                f"tasks_{self.user.id}",
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        if hasattr(self, 'user') and self.user:
            await self.channel_layer.group_discard(
                f"tasks_{self.user.id}",
                self.channel_name
            )

    async def receive(self, text_data):
        """Receive message from WebSocket."""
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'ping':
            await self.send(text_data=json.dumps({
                'type': 'pong'
            }))

    async def task_update(self, event):
        """Send task update to WebSocket."""
        await self.send(text_data=json.dumps(event['data']))

    async def task_created(self, event):
        """Send new task notification to WebSocket."""
        await self.send(text_data=json.dumps(event['data']))

    async def task_assigned(self, event):
        """Send task assignment notification to WebSocket."""
        await self.send(text_data=json.dumps(event['data']))

    @database_sync_to_async
    def get_user_from_token(self):
        """Get user from JWT token."""
        token = self.scope.get('query_string', b'').decode()
        if 'token=' in token:
            token_key = token.split('token=')[1].split('&')[0]
            try:
                access_token = AccessToken(token_key)
                user_id = access_token['user_id']
                return User.objects.get(id=user_id)
            except Exception:
                return None
        return None
