import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate, getRelativeTime } from '@/lib/utils';
import { AlertCircle, Bell, Check, CheckCheck, MessageSquare, User } from 'lucide-react';
import { Notification } from '@/types';

const sender = { id: '2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', department: 'Engineering', designation: 'Tech Lead', avatar: null, role: 'MANAGER' as const };

const mockNotifications: Notification[] = [
  { id: '1', recipient: '1', sender, type: 'TASK_ASSIGNED', title: 'New task assigned', message: 'You have been assigned to Update API documentation.', is_read: false, related_task: null, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: '2', recipient: '1', sender: { ...sender, first_name: 'Bob', last_name: 'Wilson', id: '3' }, type: 'MENTION', title: 'You were mentioned', message: 'Bob mentioned you in Code review for PR #234.', is_read: false, related_task: null, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', recipient: '1', sender, type: 'FEEDBACK', title: 'Feedback received', message: 'Your submission for Fix login bug has been approved.', is_read: true, related_task: null, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', recipient: '1', sender: null, type: 'REMINDER', title: 'Deadline approaching', message: 'Resolve SSO login issue is due tomorrow.', is_read: true, related_task: null, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '5', recipient: '1', sender, type: 'APPROVAL', title: 'Leave request approved', message: 'Your leave request for Apr 28-29 has been approved.', is_read: true, related_task: null, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'TASK_ASSIGNED':
      return User;
    case 'MENTION':
      return MessageSquare;
    case 'FEEDBACK':
      return AlertCircle;
    case 'APPROVAL':
      return Check;
    default:
      return Bell;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter((notification) => !notification.is_read) : notifications;

  const groupedNotifications = useMemo(() => filteredNotifications.reduce((acc, notification) => {
    const date = formatDate(notification.created_at);
    acc[date] = [...(acc[date] || []), notification];
    return acc;
  }, {} as Record<string, Notification[]>), [filteredNotifications]);

  const markAsRead = (id: string) => setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)));
  const markAllAsRead = () => setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Notifications</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Activity updates</h1>
          <p className="mt-2 text-slate-500">Stay on top of tasks, approvals, mentions, and reminders.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllAsRead} className="gap-2">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {(['all', 'unread'] as const).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition',
                  filter === item ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                )}
              >
                {item === 'all' ? 'All' : `Unread ${unreadCount ? `(${unreadCount})` : ''}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Unread', value: unreadCount, helper: 'Need attention', tone: 'bg-teal-50 text-teal-700', icon: Bell },
          { label: 'Task updates', value: notifications.filter((item) => item.type === 'TASK_ASSIGNED' || item.type === 'FEEDBACK').length, helper: 'Assignments and feedback', tone: 'bg-sky-50 text-sky-700', icon: User },
          { label: 'Approvals', value: notifications.filter((item) => item.type === 'APPROVAL').length, helper: 'Leave and workflow status', tone: 'bg-emerald-50 text-emerald-700', icon: Check },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.helper}</p>
                </div>
                <div className={`rounded-xl p-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="space-y-6">
        {Object.entries(groupedNotifications).map(([date, list]) => (
          <section key={date} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{date}</h2>
            {list.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <Card key={notification.id} className={cn('transition hover:shadow-md hover:shadow-slate-200/80', !notification.is_read && 'border-l-4 border-l-teal-500')}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className={cn('rounded-xl p-3', notification.is_read ? 'bg-slate-100 text-slate-500' : 'bg-teal-50 text-teal-700')}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-950">{notification.title}</h3>
                          {!notification.is_read && <Badge variant="info">New</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          {notification.sender && (
                            <div className="flex items-center gap-2">
                              <Avatar src={notification.sender.avatar} firstName={notification.sender.first_name} lastName={notification.sender.last_name} size="sm" />
                              <span className="text-xs font-medium text-slate-500">{notification.sender.first_name} {notification.sender.last_name}</span>
                            </div>
                          )}
                          <span className="text-xs text-slate-400">{getRelativeTime(notification.created_at)}</span>
                        </div>
                      </div>
                      {!notification.is_read && (
                        <Button variant="secondary" size="sm" onClick={() => markAsRead(notification.id)} className="gap-1">
                          <Check className="h-4 w-4" /> Mark read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
