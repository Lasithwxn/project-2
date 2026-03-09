import { User, UserRole } from '../types/User';

const DEFAULT_USERS: User[] = [
  {
    id: 'USR001',
    username: 'admin',
    email: 'admin@invtrack.com',
    password: 'admin123',
    role: 'ADMIN',
    status: 'ACTIVE',
    dateRegistered: new Date().toISOString(),
  },
  {
    id: 'USR002',
    username: 'john',
    email: 'john@invtrack.com',
    password: 'john123',
    role: 'MANAGER',
    status: 'ACTIVE',
    dateRegistered: new Date().toISOString(),
  },
  {
    id: 'USR003',
    username: 'sara',
    email: 'sara@invtrack.com',
    password: 'sara123',
    role: 'STAFF',
    status: 'ACTIVE',
    dateRegistered: new Date().toISOString(),
  },
];

export function getUsers(): User[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  const stored = localStorage.getItem('inventory-users');
  return stored ? JSON.parse(stored) : DEFAULT_USERS;
}

export function saveUsers(users: User[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('inventory-users', JSON.stringify(users));
  }
}

export function login(username: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password && u.status === 'ACTIVE'
  );
  
  if (user) {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    saveUsers(updatedUsers);
    localStorage.setItem('authUser', JSON.stringify({ ...user, lastLogin: new Date().toISOString() }));
    return { ...user, lastLogin: new Date().toISOString() };
  }
  
  return null;
}

export function logout(): void {
  localStorage.removeItem('authUser');
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('authUser');
  return stored ? JSON.parse(stored) : null;
}

export function isAuthorized(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = { ADMIN: 3, MANAGER: 2, STAFF: 1 };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'ADMIN';
}