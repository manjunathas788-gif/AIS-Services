import React from 'react';
import { Shield, Target, Users, Award } from 'lucide-react';
import { motion } from 'motion/react';

export function About() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-white py-24 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6 tracking-tight">Our Mission</h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              To simplify government registrations and financial services for every Indian citizen and business through technology and expert guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Target, title: 'Precision', desc: 'We ensure every application is filed with 100% accuracy to avoid rejections.' },
              { icon: Shield, title: 'Trust', desc: 'Security and confidentiality are at the heart of everything we do.' },
              { icon: Users, title: 'Accessibility', desc: 'Making complex government processes easy for everyone, everywhere.' },
            ].map((val, i) => (
              <div key={i} className="text-center">
                <div className="bg-orange-50 p-4 rounded-3xl w-fit mx-auto mb-6">
                  <val.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-4">{val.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Applications Processed', value: '50,000+' },
              { label: 'Happy Customers', value: '35,000+' },
              { label: 'Expert Agents', value: '150+' },
              { label: 'Cities Covered', value: '500+' },
            ].map((stat, i) => (
              <div key={i}>
                <h3 className="text-4xl font-bold text-orange-500 mb-2">{stat.value}</h3>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900">Our Leadership</h2>
            <p className="text-stone-600 mt-4">The visionaries behind AIS Solutions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] bg-stone-100 rounded-3xl overflow-hidden mb-6">
                  <img
                    src={`https://picsum.photos/seed/person${i}/400/500`}
                    alt="Team Member"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-xl font-bold text-stone-900">Executive {i}</h4>
                <p className="text-sm text-stone-500">Co-Founder & Director</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
