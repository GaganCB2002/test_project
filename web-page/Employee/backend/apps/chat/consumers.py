import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time chat."""

    async def connect(self):
        """Handle WebSocket connection."""
        self.room_id = self.scope['url_route']['kwargs'].get('room_id')
        self.user = await self.get_user_from_token()

        if self.user and self.room_id:
            await self.channel_layer.group_add(
                f"chat_{self.room_id}",
                self.channel_name
            )
            await self.accept()
        elif self.user:
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        if hasattr(self, 'room_id') and self.room_id:
            await self.channel_layer.group_discard(
                f"chat_{self.room_id}",
                self.channel_name
            )

    async def receive(self, text_data):
        """Receive message from WebSocket."""
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'chat_message':
            await self.channel_layer.group_send(
                f"chat_{self.room_id}",
                {
                    'type': 'chat_message',
                    'data': {
                        'sender': self.user.get_full_name(),
                        'content': data.get('content'),
                        'timestamp': data.get('timestamp')
                    }
                }
            )
        elif message_type == 'ping':
            await self.send(text_data=json.dumps({
                'type': 'pong'
            }))

    async def chat_message(self, event):
        """Send chat message to WebSocket."""
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
