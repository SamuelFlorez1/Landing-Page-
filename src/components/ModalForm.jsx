import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

export default function ModalForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    cuello_de_botella: '',
    facturacion_mensual: '',
    email: '',
    pais_indicador: '+57',
    whatsapp_numero: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    const payload = {
      nombre: formData.nombre,
      cuello_de_botella: formData.cuello_de_botella,
      facturacion_mensual: formData.facturacion_mensual,
      email: formData.email,
      telefono_completo: `${formData.pais_indicador} ${formData.whatsapp_numero}`
    };

    try {
      const resp = await fetch('https://teamnext.app.n8n.cloud/webhook/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        setIsSuccess(true);
        setTimeout(onClose, 5000);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12">
          {isSuccess ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <CheckCircle2 size={60} className="mx-auto mb-6 text-white"/>
              <h2 className="text-2xl font-bold mb-2">¡Recibido, {formData.nombre}!</h2>
              <p className="text-gray-500">Nos pondremos en contacto vía WhatsApp en 24h.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <button type="button" onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={20}/></button>
              
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-medium tracking-tight">¿Cómo te llamas?</h2>
                  <input type="text" value={formData.nombre} onChange={e => update('nombre', e.target.value)} placeholder="Tu nombre" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-white/30 outline-none" required autoFocus />
                  <button type="button" onClick={() => formData.nombre && setStep(2)} className="w-full py-4 bg-white text-black font-bold rounded-2xl">Continuar</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">¿Principal cuello de botella?</h2>
                  <div className="flex flex-col gap-3">
                    {['Leads desaparecen', 'Caos en WhatsApp', 'Dependencia de IG', 'No puedo escalar'].map(opt => (
                      <button key={opt} type="button" onClick={() => { update('cuello_de_botella', opt); setStep(3); }} className="w-full text-left px-6 py-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">Rango de facturación mensual</h2>
                  <div className="flex flex-col gap-3">
                    {['<$1k', '$1k-$5k', '$5k-$15k', '>$15k'].map(opt => (
                      <button key={opt} type="button" onClick={() => { update('facturacion_mensual', opt); setStep(4); }} className="w-full text-left px-6 py-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-medium">Datos de contacto</h2>
                  <input type="email" value={formData.email} onChange={e => update('email', e.target.value)} placeholder="Email profesional" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-white/30 outline-none" required />
                  <div className="flex gap-3">
                    <div className="w-20 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-gray-400 font-medium">+57</div>
                    <input type="tel" value={formData.whatsapp_numero} onChange={e => update('whatsapp_numero', e.target.value)} placeholder="WhatsApp" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-white/30 outline-none" required />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-white text-black font-bold rounded-2xl">
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </div>
              )}
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
