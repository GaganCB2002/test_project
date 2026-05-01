import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn, formatTime, getRelativeTime } from '@/lib/utils';
import { MessageSquare, Plus, Search, Send, Users } from 'lucide-react';
import { ChatMessage, ChatRoom } from '@/types';

const people = {
  john: { id: 'demo-employee', email: 'employee@xyz.com', first_name: 'Demo', last_name: 'Employee', department: 'Engineering', designation: 'Software Engineer', avatar: null, role: 'EMPLOYEE' as const },
  jane: { id: '2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', department: 'Engineering', designation: 'Tech Lead', avatar: null, role: 'MANAGER' as const },
  bob: { id: '3', email: 'bob@example.com', first_name: 'Bob', last_name: 'Wilson', department: 'Engineering', designation: 'Developer', avatar: null, role: 'EMPLOYEE' as const },
};

const mockRooms: ChatRoom[] = [
  { id: '1', name: 'People Operations', type: 'GROUP', participants: [people.john, people.jane, people.bob], last_message: { id: '1', room: '1', sender: people.jane, content: 'Please share today’s attendance blockers before 4 PM.', created_at: new Date(Date.now() - 1800000).toISOString() }, unread_count: 2 },
  { id: '2', name: 'Product Engineering', type: 'GROUP', participants: [people.john, people.bob], last_message: { id: '2', room: '2', sender: people.bob, content: 'PR #234 is ready for final review.', created_at: new Date(Date.now() - 3600000).toISOString() }, unread_count: 0 },
  { id: '3', name: 'Jane Smith', type: 'DIRECT', participants: [people.jane], last_message: { id: '3', room: '3', sender: people.jane, content: 'Can you review the API docs today?', created_at: new Date(Date.now() - 7200000).toISOString() }, unread_count: 1 },
];

const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: '1', room: '1', sender: people.jane, content: 'Good morning team. Please share today’s attendance blockers before 4 PM.', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: '2', room: '1', sender: people.john, content: 'No blockers from my side. Working on API documentation updates.', created_at: new Date(Date.now() - 5400000).toISOString() },
    { id: '3', room: '1', sender: people.bob, content: 'I will be offline for 30 minutes after lunch.', created_at: new Date(Date.now() - 1800000).toISOString() },
  ],
  '2': [
    { id: '4', room: '2', sender: people.bob, content: 'Pushed the new changes for the task update modal.', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: '5', room: '2', sender: people.john, content: 'Great, I will review it shortly.', created_at: new Date(Date.now() - 5400000).toISOString() },
    { id: '6', room: '2', sender: people.bob, content: 'PR #234 is ready for final review.', created_at: new Date(Date.now() - 3600000).toISOString() },
  ],
  '3': [
    { id: '7', room: '3', sender: people.jane, content: 'Can you review the API docs today?', created_at: new Date(Date.now() - 7200000).toISOString() },
  ],
};

export default function ChatPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [rooms, setRooms] = useState<ChatRoom[]>(mockRooms);
  const [activeRoom, setActiveRoom] = useState('1');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages['1']);
  const [newMessage, setNewMessage] = useState('');
  const [query, setQuery] = useState('');
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredRooms = rooms.filter((room) => room.name.toLowerCase().includes(query.toLowerCase()));
  const selectedRoom = rooms.find((room) => room.id === activeRoom);

  useEffect(() => {
    setMessages(mockMessages[activeRoom] || []);
    setRooms((prev) => prev.map((room) => (room.id === activeRoom ? { ...room, unread_count: 0 } : room)));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoom]);

  useEffect(() => {
    if (!socket) return;
    socket.on('message', (message: ChatMessage) => {
      if (message.room === activeRoom) setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off('message');
    };
  }, [socket, activeRoom]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: ChatMessage = {
      id: Date.now().toString(),
      room: activeRoom,
      sender: user!,
      content: newMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
    socket?.emit('message', message);
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Chat</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Team conversations</h1>
          <p className="mt-2 text-slate-500">Coordinate work, task handoffs, and quick updates with your team.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm">
          <span className={cn('h-2.5 w-2.5 rounded-full', isConnected ? 'bg-emerald-500' : 'bg-slate-300')} />
          {isConnected ? 'Connected' : 'Offline demo'}
        </div>
      </div>

      <div className="grid h-[calc(100vh-230px)] min-h-[620px] gap-4 lg:grid-cols-[340px_1fr]">
        <Card className={cn('overflow-hidden', !isMobileListOpen && 'hidden lg:block')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Inbox</h2>
                <p className="text-sm text-slate-500">{rooms.length} conversations</p>
              </div>
              <Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search chats..." value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto p-2">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  setActiveRoom(room.id);
                  setIsMobileListOpen(false);
                }}
                className={cn(
                  'mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition',
                  activeRoom === room.id ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {room.type === 'DIRECT' ? (
                  <Avatar src={room.participants[0]?.avatar || null} firstName={room.participants[0]?.first_name || 'U'} lastName={room.participants[0]?.last_name || 'U'} size="md" />
                ) : (
                  <div className="rounded-full bg-slate-100 p-3 text-slate-500"><Users className="h-5 w-5" /></div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold">{room.name}</p>
                    {room.last_message && <span className="text-xs text-slate-400">{getRelativeTime(room.last_message.created_at)}</span>}
                  </div>
                  <p className="truncate text-sm text-slate-500">{room.last_message?.content}</p>
                </div>
                {room.unread_count > 0 && <span className="rounded-full bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">{room.unread_count}</span>}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="flex min-w-0 flex-col overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileListOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
                  <MessageSquare className="h-5 w-5" />
                </button>
                {selectedRoom?.type === 'DIRECT' ? (
                  <Avatar src={selectedRoom.participants[0]?.avatar || null} firstName={selectedRoom.participants[0]?.first_name || 'U'} lastName={selectedRoom.participants[0]?.last_name || 'U'} size="md" />
                ) : (
                  <div className="rounded-full bg-teal-50 p-3 text-teal-700"><Users className="h-5 w-5" /></div>
                )}
                <div>
                  <h2 className="font-semibold text-slate-950">{selectedRoom?.name}</h2>
                  <p className="text-sm text-slate-500">{selectedRoom?.type === 'DIRECT' ? 'Direct message' : `${selectedRoom?.participants.length} members`}</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto bg-slate-50/70 p-5">
            <div className="space-y-4">
              {messages.map((message) => {
                const isMine = message.sender.id === user?.id;
                return (
                  <div key={message.id} className={cn('flex gap-3', isMine && 'flex-row-reverse')}>
                    <Avatar src={message.sender.avatar} firstName={message.sender.first_name} lastName={message.sender.last_name} size="sm" />
                    <div className={cn('max-w-[78%] rounded-2xl px-4 py-3 shadow-sm', isMine ? 'bg-teal-600 text-white' : 'bg-white text-slate-700')}>
                      <p className="text-sm leading-6">{message.content}</p>
                      <p className={cn('mt-1 text-xs', isMine ? 'text-teal-100' : 'text-slate-400')}>{formatTime(message.created_at)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <div className="border-t border-slate-100 bg-white p-4">
            <div className="flex gap-2">
              <Input placeholder="Type a message..." value={newMessage} onChange={(event) => setNewMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()} className="flex-1" />
              <Button onClick={handleSendMessage} className="gap-2"><Send className="h-4 w-4" /> Send</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
