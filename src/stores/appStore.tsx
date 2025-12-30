import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, mockUsers, defaultAuthState } from '@/data/mockAuth';
import { mockApi } from '@/lib/mockApi';
import { tenants as defaultTenants, leads as defaultLeads, projects as defaultProjects, units as defaultUnits, agents as defaultAgents, payments as defaultPayments } from '@/data/mockData';

interface Tenant {
  id: number | string;
  name: string;
  email: string;
  domain?: string;
  projects: number;
  users: number;
  subscription: string;
  status: string;
  revenue: string;
}

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: User['role']) => void;
  tenants: Tenant[];
  addTenant: (tenant: Omit<Tenant, 'id'>) => Promise<Tenant>;
  updateTenant: (id: string | number, data: Partial<Tenant>) => void;
  goals: { monthlyTarget: number; leadsTarget: number; conversionsTarget: number };
  setGoals: (goals: Partial<AppState['goals']>) => void;
  dateRange: number;
  setDateRange: (days: number) => void;
  leads: any[];
  addLeads: (newLeads: any[]) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(defaultAuthState.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(defaultAuthState.isAuthenticated);
  const [tenants, setTenants] = useState<Tenant[]>(defaultTenants);
  const [goals, setGoalsState] = useState({ monthlyTarget: 100, leadsTarget: 200, conversionsTarget: 25 });
  const [dateRange, setDateRange] = useState(30);
  const [leads, setLeads] = useState(defaultLeads);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    mockApi.initialize('tenants', defaultTenants);
    mockApi.initialize('leads', defaultLeads);
    mockApi.initialize('projects', defaultProjects);
    mockApi.initialize('units', defaultUnits);
    mockApi.initialize('agents', defaultAgents);
    mockApi.initialize('payments', defaultPayments);
    mockApi.initialize('users', mockUsers);
  }, []);

  const login = useCallback(async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (otp === '123456') {
      const user = mockUsers.find(u => u.email === email) || mockUsers.find(u => u.role === 'CUSTOMER');
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
    }
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const switchRole = useCallback((role: User['role']) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) setCurrentUser(user);
  }, []);

  const addTenant = useCallback(async (tenant: Omit<Tenant, 'id'>): Promise<Tenant> => {
    setIsLoading(true);
    const newTenant: Tenant = { ...tenant, id: `t_${Date.now()}` };
    setTenants(prev => [...prev, newTenant]);
    setIsLoading(false);
    return newTenant;
  }, []);

  const updateTenant = useCallback((id: string | number, data: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const setGoals = useCallback((newGoals: Partial<AppState['goals']>) => {
    setGoalsState(prev => ({ ...prev, ...newGoals }));
  }, []);

  const addLeads = useCallback((newLeads: any[]) => {
    setLeads(prev => [...prev, ...newLeads]);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, isAuthenticated, login, logout, switchRole,
      tenants, addTenant, updateTenant, goals, setGoals,
      dateRange, setDateRange, leads, addLeads, isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
