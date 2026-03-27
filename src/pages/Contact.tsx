import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  return (
    <div className="min-h-screen bg-stone-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-stone-900 mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-xl text-stone-600 leading-relaxed">
            Have questions about our services or need help with your application? Our team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {[
              { icon: Phone, title: 'Call Us', detail: '+91 98765 43210', sub: 'Mon-Sat, 9am - 6pm' },
              { icon: Mail, title: 'Email Us', detail: 'support@aissolutions.in', sub: 'Response within 24 hours' },
              { icon: MapPin, title: 'Visit Us', detail: 'AIS Solutions Tower, MG Road', sub: 'Bengaluru, Karnataka 560001' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-start space-x-6"
              >
                <div className="bg-orange-50 p-3 rounded-2xl">
                  <item.icon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">{item.title}</h4>
                  <p className="text-stone-900 font-medium mt-1">{item.detail}</p>
                  <p className="text-xs text-stone-500 mt-1">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-xl">
              <h3 className="text-2xl font-bold text-stone-900 mb-8">Send us a Message</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Subject</label>
                  <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="How can we help?" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Message</label>
                  <textarea rows={6} className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Tell us more about your query..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full md:w-auto bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center justify-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
