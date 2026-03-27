import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Application } from '../types';
import { SERVICES } from '../constants';
import { Clock, CheckCircle, XCircle, FileText, ArrowRight, User, Mail, Phone, ExternalLink, Send, Upload, Plus, Sparkles, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ProcessingDashboardProps {
  user: UserProfile;
}

export function ProcessingDashboard({ user }: ProcessingDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [remark, setRemark] = useState('');
  const [status, setStatus] = useState<Application['status']>('processing');
  const [outputUrl, setOutputUrl] = useState('');
  const [newDocRequirement, setNewDocRequirement] = useState('');
  const [aiReportInput, setAiReportInput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'applications'),
      where('assignedTo', '==', user.uid),
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

  const getAIReportPrompt = (app: Application) => {
    const { data } = app;
    return `Act as a Senior Bank Credit Analyst. Generate a professional and detailed 3-year project report for a bank loan application based on the following data:

BUSINESS INFORMATION:
- Business Name: ${data?.businessName || 'N/A'}
- Promoter Name: ${data?.promoterName || 'N/A'}
- Sector/Industry: ${data?.sector || 'N/A'}
- Business Location: ${data?.location || 'N/A'}
- Promoter Experience: ${data?.experience || 'N/A'}

PROJECT FINANCIALS:
- Total Project Cost: ₹${data?.totalProjectCost || 0}
- Loan Amount Requested: ₹${data?.loanAmount || 0}
- Promoter Equity Contribution: ₹${data?.equity || 0}

REPORT STRUCTURE REQUIREMENTS:
1. Executive Summary: Overview of the business and project viability.
2. Market Analysis: Brief sector outlook and competitive position.
3. Financial Projections: Detailed 3-year projections including Revenue, Expenses, Net Profit, Assets, and Liabilities.
4. Key Financial Ratios: Calculation and analysis of GP Margin, NP Margin, DSCR (Debt Service Coverage Ratio), and Current Ratio.
5. SWOT Analysis: Strengths, Weaknesses, Opportunities, and Threats.
6. Conclusion & Recommendation: Professional opinion on the creditworthiness and loan eligibility.

Please ensure all financial calculations are realistic and consistent with the project cost and loan amount provided. Format the report professionally for bank submission.`;
  };

  const handleCopyPrompt = () => {
    if (!selectedApp) return;
    const prompt = getAIReportPrompt(selectedApp);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    try {
      await updateDoc(doc(db, 'applications', selectedApp.id), {
        status,
        remarks: remark,
        outputUrl: outputUrl || selectedApp.outputUrl || '',
        aiReport: aiReportInput || selectedApp.aiReport || '',
        updatedAt: new Date().toISOString()
      });
      setSelectedApp(null);
      setRemark('');
      setOutputUrl('');
      setAiReportInput('');
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleAddDocRequirement = async () => {
    if (!selectedApp || !newDocRequirement.trim()) return;
    const currentReqs = selectedApp.requiredDocuments || [];
    if (currentReqs.includes(newDocRequirement.trim())) return;

    try {
      await updateDoc(doc(db, 'applications', selectedApp.id), {
        requiredDocuments: [...currentReqs, newDocRequirement.trim()],
        updatedAt: new Date().toISOString()
      });
      setNewDocRequirement('');
    } catch (err) {
      console.error(err);
      alert('Failed to add document requirement');
    }
  };

  const handleRemoveDocRequirement = async (docName: string) => {
    if (!selectedApp) return;
    const currentReqs = selectedApp.requiredDocuments || [];
    try {
      await updateDoc(doc(db, 'applications', selectedApp.id), {
        requiredDocuments: currentReqs.filter(r => r !== docName),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error(err);
      alert('Failed to remove document requirement');
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-stone-900">Processing Unit Dashboard</h1>
        <p className="text-stone-600 mt-1">Manage and process assigned service applications.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-50 flex items-center justify-between">
              <h3 className="font-bold text-stone-900">Assigned Leads</h3>
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                {applications.length} Active
              </span>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center text-stone-500">No applications assigned to you yet.</div>
            ) : (
              <div className="divide-y divide-stone-50">
                {applications.map((app) => {
                  const service = SERVICES.find(s => s.id === app.serviceId);
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => {
                        setSelectedApp(app);
                        setStatus(app.status);
                        setRemark(app.remarks || '');
                        setOutputUrl(app.outputUrl || '');
                        setAiReportInput(app.aiReport || '');
                      }}
                      className={cn(
                        "p-6 cursor-pointer transition-colors",
                        selectedApp?.id === app.id ? "bg-orange-50/50" : "hover:bg-stone-50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-100">
                            <FileText className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900">{service?.name}</h4>
                            <p className="text-xs text-stone-500 mt-1">
                              ID: {app.id.slice(0, 8)} • {format(new Date(app.createdAt), 'MMM dd, HH:mm')}
                            </p>
                            <div className="mt-2 flex items-center space-x-2">
                              <span className={cn(
                                "inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                app.status === 'completed' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              )}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-stone-300" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Processing Panel */}
        <div className="lg:col-span-1">
          {selectedApp ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-stone-100 shadow-xl p-8 sticky top-24"
            >
              <h3 className="text-xl font-bold text-stone-900 mb-6">Process Application</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Customer Data</label>
                  <div className="bg-stone-50 p-4 rounded-2xl space-y-2">
                    {Object.entries(selectedApp.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium text-stone-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Required Documents</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newDocRequirement}
                      onChange={(e) => setNewDocRequirement(e.target.value)}
                      placeholder="e.g. Aadhaar Card"
                      className="flex-1 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleAddDocRequirement}
                      className="bg-stone-900 text-white p-2 rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.requiredDocuments?.map((req) => (
                      <span key={req} className="inline-flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                        {req}
                        <button onClick={() => handleRemoveDocRequirement(req)} className="ml-2 hover:text-red-600">
                          <XCircle className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Uploaded Documents</label>
                  <div className="space-y-2">
                    {selectedApp.documents.length > 0 ? (
                      selectedApp.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between bg-stone-50 p-3 rounded-xl">
                          <span className="text-sm font-medium text-stone-900">{doc.name}</span>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 italic">No documents uploaded yet.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Update Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Application['status'])}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Output URL (Certificate/PDF)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={outputUrl}
                      onChange={(e) => setOutputUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Upload className="absolute right-4 top-3 h-5 w-5 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Internal Remarks</label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={4}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Add notes for the customer..."
                  />
                </div>

                {selectedApp.serviceId === 'bank-report' && (
                  <div className="pt-6 border-t border-stone-100 space-y-4">
                    <div className="bg-stone-900 rounded-2xl p-5 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-4 w-4 text-orange-400" />
                          <span className="text-sm font-bold">Professional AI Prompt</span>
                        </div>
                        <button
                          onClick={handleCopyPrompt}
                          className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors flex items-center space-x-2 text-xs font-bold"
                        >
                          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-400 leading-relaxed">
                        Copy this prompt and use it in your preferred AI tool (e.g. Kuse AI, ChatGPT) to generate a professional bank report.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Upload AI Report Content</label>
                      <textarea
                        value={aiReportInput}
                        onChange={(e) => setAiReportInput(e.target.value)}
                        rows={6}
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Paste the AI-generated report content here..."
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpdateStatus}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Update Application</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-stone-100 rounded-3xl border-2 border-dashed border-stone-200 p-12 text-center text-stone-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Select an application to start processing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
