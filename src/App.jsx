import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, Cpu, ArrowRight, ShieldCheck, BarChart3 } from 'lucide-react';
import ModalForm from './components/ModalForm';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="text-xl font-bold tracking-tighter">SYNAPSE<span className="text-gray-500">.AI</span></div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 border border-white/10 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all bg-white/5"
        >
          Iniciar Diagnóstico
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 px-5 text-center">
        <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto">
          
          {/* Insignias n8n */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-gray-400">
              <Zap size={14} className="text-yellow-400"/> Integrado con n8n
            </span>
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-gray-400">
              <Cpu size={14} className="text-purple-400"/> Flujos con IA
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-[90px] leading-[1] font-medium tracking-tight mb-10">
            Escala tu negocio con <br/><span className="text-gray-400 italic font-light">inteligencia</span> artificial
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-14 leading-relaxed">
            Diseñamos infraestructuras de automatización que capturan, nutren y cierran leads sin que tengas que intervenir en el proceso.
          </motion.p>

          <motion.div variants={itemVariants}>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative px-12 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Automatizar mi negocio <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </span>
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><MessageSquare size={24}/></div>
            <h3 className="text-xl font-medium">WhatsApp Automation</h3>
            <p className="text-gray-500 leading-relaxed">Respuestas instantáneas y cualificación de leads 24/7 con IA personalizada.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><BarChart3 size={24}/></div>
            <h3 className="text-xl font-medium">Control Total</h3>
            <p className="text-gray-500 leading-relaxed">Dashboards en tiempo real de tu facturación y flujo de conversión.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><ShieldCheck size={24}/></div>
            <h3 className="text-xl font-medium">Infraestructura n8n</h3>
            <p className="text-gray-500 leading-relaxed">Flujos robustos y escalables que conectan todo tu ecosistema digital.</p>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm tracking-widest uppercase">© 2026 SYNAPSE . IA - Built for Scale</p>
      </footer>

      <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
