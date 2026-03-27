import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Shield, ArrowRight, CheckCircle, FileText, Briefcase, Car, CreditCard, Utensils, FileCheck, ClipboardList, Banknote } from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  FileText, Briefcase, Car, CreditCard, Utensils, FileCheck, ClipboardList, Banknote
};

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 leading-tight">
                Digital Services for <span className="text-orange-600">Modern India</span>
              </h1>
              <p className="mt-6 text-xl text-stone-600 leading-relaxed">
                Apply for GST, PAN, UDYAM, and more in minutes. Secure, fast, and professional assistance for all your registration and financial needs.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center group"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#services"
                  className="w-full sm:w-auto bg-white text-stone-900 border border-stone-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-stone-50 transition-all"
                >
                  View All Services
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900">Our Services</h2>
            <p className="mt-4 text-stone-600">Comprehensive solutions for your business and personal needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = iconMap[service.icon];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="bg-orange-50 p-3 rounded-2xl w-fit mb-6 group-hover:bg-orange-600 transition-colors">
                    <Icon className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    to={`/service/${service.id}`}
                    className="flex items-center text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Apply Now
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-stone-900 mb-8 leading-tight">
                Why thousands of customers trust <span className="text-orange-600">AIS Solutions</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Expert Assistance', desc: 'Our processing units are experts in their respective fields.' },
                  { title: 'Secure & Confidential', desc: 'Your documents and data are protected with bank-grade security.' },
                  { title: 'Real-time Tracking', desc: 'Monitor your application status every step of the way.' },
                  { title: 'Transparent Pricing', desc: 'No hidden charges. Pay only for what you need.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="mt-1 bg-green-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900">{item.title}</h4>
                      <p className="text-stone-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-stone-100 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://picsum.photos/seed/business/800/800"
                  alt="Business Professional"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 max-w-xs">
                <p className="text-stone-900 font-bold mb-2">"The fastest GST registration I've ever experienced. Highly recommended!"</p>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-orange-100"></div>
                  <span className="text-xs font-medium text-stone-500">— Rajesh Kumar, SME Owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to grow your business?</h2>
          <p className="text-orange-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of Indian entrepreneurs who have simplified their registration process with AIS Solutions.
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-orange-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-stone-50 transition-all shadow-xl"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
