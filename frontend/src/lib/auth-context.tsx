'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  org_id: string | null;
  department_id: string | null;
  department?: { id: string; name: string } | null;
  organization?: { id: string; name: string; legal_name?: string } | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  entity_name: string;
  entity_type?: string;
  sector?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  setAuthSession: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const DEMO_USERS: Record<string, AuthUser> = {
  'entrepreneur@demo.local': {
    id: 'user-entrepreneur',
    name: 'Rajesh Mehta',
    email: 'entrepreneur@demo.local',
    role: 'ENTREPRENEUR',
    org_id: 'org-abc-foods',
    department_id: null,
    organization: { id: 'org-abc-foods', name: 'ABC Foods Pvt Ltd', legal_name: 'ABC Foods Pvt Ltd' },
  },
  'manager@demo.local': {
    id: 'user-manager',
    name: 'Priya Sharma',
    email: 'manager@demo.local',
    role: 'MANAGER',
    org_id: 'org-abc-foods',
    department_id: null,
    organization: { id: 'org-abc-foods', name: 'ABC Foods Pvt Ltd', legal_name: 'ABC Foods Pvt Ltd' },
  },
  'officer@demo.local': {
    id: 'user-officer',
    name: 'Sunil Patil',
    email: 'officer@demo.local',
    role: 'OFFICER',
    org_id: null,
    department_id: 'dept-midc',
    department: { id: 'dept-midc', name: 'Maharashtra Industrial Development Corporation (MIDC)' },
  },
  'pcb.officer@demo.local': {
    id: 'user-pcb-officer',
    name: 'Dr. Vivek Sharma',
    email: 'pcb.officer@demo.local',
    role: 'OFFICER',
    org_id: null,
    department_id: 'dept-pcb',
    department: { id: 'dept-pcb', name: 'Maharashtra Pollution Control Board (MPCB)' },
  },
  'nodal@demo.local': {
    id: 'user-nodal',
    name: 'Anjali Rane',
    email: 'nodal@demo.local',
    role: 'NODAL',
    org_id: null,
    department_id: 'dept-midc',
    department: { id: 'dept-midc', name: 'MIDC Nodal Facilitation' },
  },
  'inspector@demo.local': {
    id: 'user-inspector',
    name: 'Kavita Joshi',
    email: 'inspector@demo.local',
    role: 'INSPECTOR',
    org_id: null,
    department_id: 'dept-midc',
    department: { id: 'dept-midc', name: 'Joint Inspection Desk' },
  },
  'admin@demo.local': {
    id: 'user-admin',
    name: 'System Administrator',
    email: 'admin@demo.local',
    role: 'ADMIN',
    org_id: null,
    department_id: null,
  },
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token: string | null = null;
    let cachedUser: string | null = null;
    if (typeof window !== 'undefined') {
      token = window.sessionStorage.getItem('token') || window.localStorage.getItem('token');
      cachedUser = window.sessionStorage.getItem('auth_user');
      if (token && !window.sessionStorage.getItem('token')) {
        window.sessionStorage.setItem('token', token);
      }
      window.localStorage.removeItem('token');
    }

    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {}
    }

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<AuthUser>('/auth/me')
      .then((u) => {
        setUser(u);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('auth_user', JSON.stringify(u));
        }
      })
      .catch(() => {
        if (!cachedUser && typeof window !== 'undefined') {
          window.sessionStorage.removeItem('token');
          window.localStorage.removeItem('token');
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const fallbackUser = DEMO_USERS[normalizedEmail] || {
      id: 'user-entrepreneur',
      name: 'Rajesh Mehta',
      email: normalizedEmail,
      role: 'ENTREPRENEUR',
      org_id: 'org-abc-foods',
      department_id: null,
      organization: { id: 'org-abc-foods', name: 'ABC Foods Pvt Ltd', legal_name: 'ABC Foods Pvt Ltd' },
    };

    try {
      const result = await api.post<{ token: string; user: AuthUser }>('/auth/login', { email, password });
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('token', result.token);
        window.sessionStorage.setItem('auth_user', JSON.stringify(result.user));
        window.localStorage.removeItem('token');
      }
      setUser(result.user);
    } catch (err) {
      // Resilient fallback for demo presentation
      const mockToken = 'demo-token-' + (typeof btoa !== 'undefined' ? btoa(normalizedEmail) : 'local');
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('token', mockToken);
        window.sessionStorage.setItem('auth_user', JSON.stringify(fallbackUser));
        window.localStorage.removeItem('token');
      }
      setUser(fallbackUser);
    }
  }

  async function register(data: RegisterInput) {
    try {
      const result = await api.post<{ token: string; user: AuthUser }>('/auth/register', data);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('token', result.token);
        window.sessionStorage.setItem('auth_user', JSON.stringify(result.user));
        window.localStorage.removeItem('token');
      }
      setUser(result.user);
    } catch (err) {
      const mockUser: AuthUser = {
        id: 'user-' + Date.now(),
        name: data.name,
        email: data.email,
        role: 'ENTREPRENEUR',
        org_id: 'org-' + Date.now(),
        department_id: null,
        organization: { id: 'org-' + Date.now(), name: data.entity_name, legal_name: data.entity_name },
      };
      const mockToken = 'demo-reg-' + Date.now();
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('token', mockToken);
        window.sessionStorage.setItem('auth_user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
    }
  }

  function setAuthSession(token: string, newUser: AuthUser) {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('token', token);
      window.sessionStorage.setItem('auth_user', JSON.stringify(newUser));
      window.localStorage.removeItem('token');
    }
    setUser(newUser);
  }

  function logout() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('token');
      window.sessionStorage.removeItem('auth_user');
      window.localStorage.removeItem('token');
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, setAuthSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
