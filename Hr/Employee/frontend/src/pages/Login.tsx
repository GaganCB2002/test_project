import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const message = err.response
        ? (err.response.data.message || err.response.data.detail || err.response.data.non_field_errors?.[0] || err.response.data.error || 'Invalid credentials. Please try again.')
        : 'Server not reachable. Please ensure the Employee Backend (Port 8000) is running.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_480px]">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Employee Hub</p>
            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-slate-950">
              Secure access to attendance, tasks, tickets, and work tracking.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Login automatically starts your attendance session, unlocks your dashboard, and keeps your workday records in one place.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Auto attendance', text: 'Clock-in begins when you sign in and ends cleanly on logout.' },
                { title: 'Break tracking', text: 'Breaks are captured inside the same daily work session.' },
                { title: 'Task workspace', text: 'Update progress, upload files, and submit work for review.' },
                { title: 'Support tickets', text: 'Raise HR, payroll, technical, leave, or general issues quickly.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur">
                  <div className="mb-3 inline-flex rounded-xl bg-teal-50 p-2 text-teal-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-slate-200 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur">
            <CardContent className="p-8 sm:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-sky-600 text-2xl font-bold text-white shadow-sm">
                  XYZ
                </div>
                <h2 className="text-2xl font-bold text-slate-950">Welcome back</h2>
                <p className="mt-2 text-slate-500">Sign in with your company account to continue.</p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  Sign in
                </Button>
              </form>

              <Card className="mt-6 border-amber-200 bg-amber-50/50 shadow-sm backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Master Credentials</p>
                  <div className="mt-2 space-y-1 text-sm text-amber-800">
                    <p><span className="font-semibold">Email:</span> emp@company.com</p>
                    <p><span className="font-semibold">Password:</span> emp123</p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => window.location.href = 'http://127.0.0.1:3005/login'}
                  className="text-xs font-bold text-teal-600 hover:underline uppercase tracking-widest"
                >
                  Quick Access: IIT Help Desk
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
