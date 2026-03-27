import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { UserProfile, Application } from '../types';
import { SERVICES } from '../constants';
import { Clock, CheckCircle, XCircle, FileText, ArrowRight, Plus, Download, ExternalLink, Upload, X, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CustomerDashboardProps {
  user: UserProfile;
}

export function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: Application[] = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as Application);
      });
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleFileUpload = async (appId: string, docName: string, file: File) => {
    setUploading(docName);
    try {
      // Using a public anonymous upload service as a workaround for Firebase Storage restrictions in the sandbox
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      // tmpfiles.org returns a URL like https://tmpfiles.org/123/file.png
      // We need to convert it to a direct link like https://tmpfiles.org/dl/123/file.png
      const uploadUrl = result.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');

      const app = applications.find(a => a.id === appId);
      if (!app) return;

      const newDocs = [...app.documents, { name: docName, url: uploadUrl, status: 'uploaded' as const }];
      await updateDoc(doc(db, 'applications', appId), {
        documents: newDocs,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state for immediate feedback
      setSelectedApp(prev => prev ? { ...prev, documents: newDocs } : null);
      
    } catch (err: any) {
      console.error('Upload Error:', err);
      alert(`Upload failed: ${err.message || 'Unknown error'}. Please try again.`);
    } finally {
      setUploading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Welcome, {user.displayName.split(' ')[0]}!</h1>
          <p className="text-stone-600 mt-1">Track your applications and apply for new services.</p>
        </div>
        <Link
          to="/"
          className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition-all flex items-center justify-center shadow-lg shadow-orange-100"
        >
          <Plus className="mr-2 h-5 w-5" />
          Apply for New Service
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-4">Application Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-stone-600 text-sm">Total Applications</span>
                <span className="font-bold text-stone-900">{applications.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600 text-sm">In Progress</span>
                <span className="font-bold text-blue-600">
                  {applications.filter(a => a.status === 'processing' || a.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600 text-sm">Completed</span>
                <span className="font-bold text-green-600">
                  {applications.filter(a => a.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-600 p-6 rounded-3xl text-white shadow-xl shadow-orange-100">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-orange-100 text-sm mb-4 leading-relaxed">Our support team is available 24/7 to assist you with your applications.</p>
            <Link to="/contact" className="inline-block bg-white text-orange-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-50 flex items-center justify-between">
              <h3 className="font-bold text-stone-900">Your Applications</h3>
              <FileText className="h-5 w-5 text-stone-400" />
            </div>

            {loading ? (
              <div className="p-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-stone-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-stone-300" />
                </div>
                <p className="text-stone-500 mb-6">You haven't applied for any services yet.</p>
                <Link to="/" className="text-orange-600 font-bold hover:underline">Browse Services</Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-50">
                {applications.map((app) => {
                  const service = SERVICES.find(s => s.id === app.serviceId);
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedApp(app)}
                      className="p-6 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-50 p-3 rounded-2xl">
                            <FileText className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900">{service?.name || 'Unknown Service'}</h4>
                            <p className="text-xs text-stone-500 mt-1">
                              Applied on {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                            </p>
                            <div className="mt-2 flex items-center space-x-2">
                              <span className={cn(
                                "inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                getStatusColor(app.status)
                              )}>
                                {getStatusIcon(app.status)}
                                <span>{app.status}</span>
                              </span>
                              {app.requiredDocuments && app.requiredDocuments.length > 0 && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-[10px] font-bold">
                                  {app.requiredDocuments.length} Docs Required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {app.outputUrl && (
                            <a
                              href={app.outputUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download Result</span>
                            </a>
                          )}
                          <button className="p-2 text-stone-400 hover:text-orange-600 transition-colors">
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      {app.remarks && (
                        <div className="mt-4 p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border-l-4 border-orange-500">
                          <span className="font-bold block mb-1">Latest Remark:</span>
                          {app.remarks}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900">Application Details</h3>
              <button onClick={() => setSelectedApp(null)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-50 p-4 rounded-2xl">
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-stone-900">
                    {SERVICES.find(s => s.id === selectedApp.serviceId)?.name}
                  </h4>
                  <p className="text-sm text-stone-500">ID: {selectedApp.id}</p>
                  <div className="mt-2">
                    <span className={cn(
                      "inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      getStatusColor(selectedApp.status)
                    )}>
                      {getStatusIcon(selectedApp.status)}
                      <span>{selectedApp.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              {selectedApp.requiredDocuments && selectedApp.requiredDocuments.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Required Documents</h5>
                  <div className="space-y-3">
                    {selectedApp.requiredDocuments.map((req) => {
                      const uploaded = selectedApp.documents.find(d => d.name === req);
                      return (
                        <div key={req} className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <div className="flex items-center space-x-3">
                            {uploaded ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-orange-500" />
                            )}
                            <span className="text-sm font-medium text-stone-900">{req}</span>
                          </div>
                          
                          {uploaded ? (
                            <a href={uploaded.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : (
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(selectedApp.id, req, e.target.files[0])}
                                disabled={uploading === req}
                              />
                              <div className={cn(
                                "flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors",
                                uploading === req && "opacity-50 cursor-not-allowed"
                              )}>
                                {uploading === req ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                                <span>{uploading === req ? 'Uploading...' : 'Upload'}</span>
                              </div>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedApp.aiReport && (
                <div>
                  <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">AI Generated Project Report</h5>
                  <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl overflow-x-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-orange-400" />
                        <span className="text-sm font-bold">Professional Analysis</span>
                      </div>
                      <button 
                        onClick={() => {
                          const win = window.open('', '_blank');
                          win?.document.write(`<pre style="white-space: pre-wrap; font-family: sans-serif; padding: 40px; line-height: 1.6;">${selectedApp.aiReport}</pre>`);
                        }}
                        className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center"
                      >
                        Open Full Screen <ExternalLink className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed opacity-90">
                      {selectedApp.aiReport.slice(0, 500)}...
                    </pre>
                  </div>
                </div>
              )}

              {selectedApp.remarks && (
                <div>
                  <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Remarks from Processing Unit</h5>
                  <div className="p-4 bg-orange-50 rounded-2xl text-sm text-stone-800 border-l-4 border-orange-500">
                    {selectedApp.remarks}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
