import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { UserProfile, Application } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Logo } from '../components/Logo';
import { Shield, ArrowLeft, CheckCircle, AlertCircle, FileText, Send, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceDetailProps {
  user: UserProfile | null;
}

export function ServiceDetail({ user }: ServiceDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const service = SERVICES.find(s => s.id === id);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-stone-900">Service Not Found</h2>
        <Link to="/" className="mt-4 text-orange-600 font-bold hover:underline">Back to Home</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const newApp: Omit<Application, 'id'> = {
        userId: user.uid,
        serviceId: service.id,
        status: 'pending',
        data: formData,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'applications'), newApp);
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-stone-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-100 p-12 text-center"
        >
          <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Application Submitted!</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Your application for <strong>{service.name}</strong> has been received. You can track its status in your dashboard.
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-stone-400">
            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-orange-600"></div>
            <span>Redirecting to dashboard...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-stone-500 hover:text-orange-600 transition-colors mb-8 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Service Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm sticky top-24">
              <div className="bg-orange-50 p-3 rounded-2xl w-fit mb-6">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-stone-900 mb-4">{service.name}</h1>
              <p className="text-stone-600 text-sm leading-relaxed mb-8">
                {service.description}
              </p>
              
              <div className="space-y-4 pt-8 border-t border-stone-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Service Fee</span>
                  <span className="font-bold text-stone-900">₹{service.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Processing Time</span>
                  <span className="font-bold text-stone-900">2-3 Working Days</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-start space-x-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                  Your data is encrypted and secure. We never share your personal information with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-8">Application Form</h2>
              
              {!user && (
                <div className="mb-8 p-6 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center text-center">
                  <Logo className="h-12 mb-3" />
                  <p className="text-sm text-stone-600 font-bold mb-4">Login required to apply</p>
                  <Link
                    to="/login"
                    className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-700 transition-colors"
                  >
                    Login with Google
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {service.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      disabled={!user || loading}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all disabled:opacity-50"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={!user || loading}
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-center text-[10px] text-stone-400">
                    By submitting, you agree to our terms and conditions.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
