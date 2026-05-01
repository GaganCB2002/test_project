import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { User } from '@/types';
import { Loader2, Plus, ShieldCheck, UserCog, Users } from 'lucide-react';

export default function PeoplePage() {
  const { user, createEmployee } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    department: '',
    designation: '',
    role: 'EMPLOYEE' as User['role'],
  });

  const isAllowed = user?.role === 'ADMIN' || user?.role === 'HR';

  const loadUsers = async () => {
    if (!isAllowed) return;
    setIsLoading(true);
    try {
      const users = await authService.getUsers();
      setEmployees(users);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [isAllowed]);

  const handleCreateEmployee = async () => {
    setIsSaving(true);
    try {
      await createEmployee({
        ...newEmployee,
        is_active: true,
      });
      setNewEmployee({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
        department: '',
        designation: '',
        role: 'EMPLOYEE',
      });
      setIsModalOpen(false);
      await loadUsers();
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusToggle = async (employee: User) => {
    setIsSaving(true);
    try {
      await authService.updateUserStatus(employee.id, !employee.is_active);
      await loadUsers();
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await authService.updateUser(editingUser.id, {
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        department: editingUser.department,
        designation: editingUser.designation,
        role: editingUser.role,
        is_active: editingUser.is_active,
      });
      setEditingUser(null);
      await loadUsers();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAllowed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <ShieldCheck className="mx-auto h-10 w-10 text-teal-600" />
        <h1 className="mt-4 text-2xl font-bold text-slate-950">Access restricted</h1>
        <p className="mt-2 text-slate-500">Only HR and admin accounts can manage employees.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading employees...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">People</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Employee account management</h1>
          <p className="mt-2 text-slate-500">Create, activate, disable, and review employee accounts from one place.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total employees', value: employees.length, icon: Users, tone: 'bg-sky-50 text-sky-700' },
          { label: 'Active', value: employees.filter((item) => item.is_active).length, icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-700' },
          { label: 'Disabled', value: employees.filter((item) => !item.is_active).length, icon: UserCog, tone: 'bg-amber-50 text-amber-700' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-950">
                    {employee.first_name} {employee.last_name}
                  </h2>
                  <Badge variant={employee.is_active ? 'success' : 'default'}>
                    {employee.is_active ? 'Active' : 'Disabled'}
                  </Badge>
                  <Badge variant="info">{employee.role}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-500">{employee.email}</p>
                <p className="mt-1 text-sm text-slate-500">{employee.department} • {employee.designation}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setEditingUser(employee)}>
                  Edit
                </Button>
                <Button
                  variant={employee.is_active ? 'secondary' : 'primary'}
                  onClick={() => void handleStatusToggle(employee)}
                  isLoading={isSaving}
                >
                  {employee.is_active ? 'Disable' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Employee Account" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" value={newEmployee.first_name} onChange={(event) => setNewEmployee({ ...newEmployee, first_name: event.target.value })} />
            <Input label="Last name" value={newEmployee.last_name} onChange={(event) => setNewEmployee({ ...newEmployee, last_name: event.target.value })} />
          </div>
          <Input label="Email" type="email" value={newEmployee.email} onChange={(event) => setNewEmployee({ ...newEmployee, email: event.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Password" type="password" value={newEmployee.password} onChange={(event) => setNewEmployee({ ...newEmployee, password: event.target.value })} />
            <Input label="Confirm password" type="password" value={newEmployee.password_confirm} onChange={(event) => setNewEmployee({ ...newEmployee, password_confirm: event.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Department" value={newEmployee.department} onChange={(event) => setNewEmployee({ ...newEmployee, department: event.target.value })} />
            <Input label="Designation" value={newEmployee.designation} onChange={(event) => setNewEmployee({ ...newEmployee, designation: event.target.value })} />
          </div>
          <Select
            label="Role"
            options={[
              { value: 'EMPLOYEE', label: 'Employee' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'HR', label: 'HR' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
            value={newEmployee.role}
            onChange={(event) => setNewEmployee({ ...newEmployee, role: event.target.value as User['role'] })}
          />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleCreateEmployee()} isLoading={isSaving}>Create Employee</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Edit Employee Account" size="lg">
        {editingUser && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" value={editingUser.first_name} onChange={(event) => setEditingUser({ ...editingUser, first_name: event.target.value })} />
              <Input label="Last name" value={editingUser.last_name} onChange={(event) => setEditingUser({ ...editingUser, last_name: event.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Department" value={editingUser.department} onChange={(event) => setEditingUser({ ...editingUser, department: event.target.value })} />
              <Input label="Designation" value={editingUser.designation} onChange={(event) => setEditingUser({ ...editingUser, designation: event.target.value })} />
            </div>
            <Select
              label="Role"
              options={[
                { value: 'EMPLOYEE', label: 'Employee' },
                { value: 'MANAGER', label: 'Manager' },
                { value: 'HR', label: 'HR' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
              value={editingUser.role}
              onChange={(event) => setEditingUser({ ...editingUser, role: event.target.value as User['role'] })}
            />
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button onClick={() => void handleUpdateEmployee()} isLoading={isSaving}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
