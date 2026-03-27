import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, getDocs, where, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { db, firebaseConfig, auth } from '../firebase';
import { UserProfile, Application } from '../types';
import { SERVICES } from '../constants';
import { Users, FileText, TrendingUp, DollarSign, UserPlus, CheckCircle, Clock, AlertCircle, BarChart3, PieChart, ArrowRight, X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../lib/utils';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  alert(`Firestore Error: ${errInfo.error} during ${operationType} on ${path}`);
}

interface AdminDashboardProps {
  user: UserProfile;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'users'>('overview');
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffName, setStaffName] = useState('');
  const [creatingStaff, setCreatingStaff] = useState(false);

  useEffect(() => {
    const unsubApps = onSnapshot(query(collection(db, 'applications'), orderBy('createdAt', 'desc')), (snapshot) => {
      const apps: Application[] = [];
      snapshot.forEach((doc) => apps.push({ id: doc.id, ...doc.data() } as Application));
      setApplications(apps);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const u: UserProfile[] = [];
      snapshot.forEach((doc) => u.push(doc.data() as UserProfile));
      setUsers(u);
      setLoading(false);
    });

    return () => {
      unsubApps();
      unsubUsers();
    };
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail || !staffPassword || !staffName) return;

    setCreatingStaff(true);
    const secondaryAppName = `Secondary_${Date.now()}`;
    let secondaryApp;
    try {
      // Create a secondary app instance to avoid signing out the current admin
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, staffEmail, staffPassword);
      const newUser = userCredential.user;

      // Create user profile in Firestore
      const profile: UserProfile = {
        uid: newUser.uid,
        email: staffEmail,
        displayName: staffName,
        role: 'processing_unit',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', newUser.uid), profile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${newUser.uid}`);
      }
      
      alert('Staff account created successfully!');
      setShowCreateStaff(false);
      setStaffEmail('');
      setStaffPassword('');
      setStaffName('');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to create staff account: ${err.message}`);
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch (deleteErr) {
          console.error('Error deleting secondary app:', deleteErr);
        }
      }
      setCreatingStaff(false);
    }
  };

  const processingUnits = users.filter(u => u.role === 'processing_unit');
  const revenue = applications.filter(a => a.status === 'completed').reduce((acc, app) => {
    const service = SERVICES.find(s => s.id === app.serviceId);
    return acc + (service?.price || 0);
  }, 0);

  const serviceData = SERVICES.map(s => ({
    name: s.name,
    count: applications.filter(a => a.serviceId === s.id).length
  })).filter(d => d.count > 0);

  const handleAssign = async (appId: string, puId: string) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        assignedTo: puId,
        status: 'processing',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `applications/${appId}`);
    }
  };

  const handleRoleChange = async (uid: string, role: UserProfile['role']) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Admin Command Center</h1>
          <p className="text-stone-600 mt-1">Full control over users, leads, and revenue.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-stone-200 shadow-sm">
          {(['overview', 'leads', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                activeTab === tab ? "bg-orange-600 text-white shadow-md" : "text-stone-500 hover:text-stone-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Total Leads', value: applications.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Users', value: users.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Processing Units', value: processingUnits.length, icon: UserPlus, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm"
              >
                <div className={cn("p-3 rounded-2xl w-fit mb-4", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-bold text-stone-900 mt-1">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
              <h3 className="font-bold text-stone-900 mb-8 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-orange-600" />
                Service-wise Distribution
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f5f5f4' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#ea580c', '#2563eb', '#16a34a', '#9333ea', '#db2777'][index % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
              <h3 className="font-bold text-stone-900 mb-8 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-orange-600" />
                Recent Activity
              </h3>
              <div className="space-y-6">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-xs">
                        {app.userId.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">
                          {SERVICES.find(s => s.id === app.serviceId)?.name}
                        </p>
                        <p className="text-xs text-stone-500">{format(new Date(app.createdAt), 'MMM dd, HH:mm')}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      app.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    )}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Lead Details</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-6">
                    <p className="font-bold text-stone-900">{SERVICES.find(s => s.id === app.serviceId)?.name}</p>
                    <p className="text-xs text-stone-500 mt-1">ID: {app.id.slice(0, 8)} • {format(new Date(app.createdAt), 'MMM dd')}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      app.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    )}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <select
                      value={app.assignedTo || ''}
                      onChange={(e) => handleAssign(app.id, e.target.value)}
                      className="bg-stone-50 border border-stone-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Unassigned</option>
                      {processingUnits.map(pu => (
                        <option key={pu.uid} value={pu.uid}>{pu.displayName}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-6">
                    <button className="text-stone-400 hover:text-orange-600 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateStaff(true)}
              className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center shadow-lg shadow-stone-100"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Staff Account
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px]">
                          {u.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-stone-900">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-stone-600">{u.email}</td>
                    <td className="px-6 py-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.uid, e.target.value as UserProfile['role'])}
                        className="bg-stone-50 border border-stone-100 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="processing_unit">Processing Unit</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 text-xs text-stone-500">
                      {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Staff Modal */}
      {showCreateStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900">Create Staff Account</h3>
              <button onClick={() => setShowCreateStaff(false)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Staff Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Staff Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                  <input
                    type="email"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="staff@aissolutions.in"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Initial Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                  <input
                    type="password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingStaff}
                className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {creatingStaff ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
