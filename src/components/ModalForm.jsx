import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

export default function ModalForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados mapeados a los requerimientos exactos de n8n
  const [formData, setFormData] = useState({
    nombre: '',
    cuello_de_botella: '',
    facturacion_mensual: '',
    email: '',
    pais_indicador: '+57',
    whatsapp_numero: '',
  });

  // Resetear estados al cerrar el modal
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
        setIsSubmitting(false);
        setFormData({
          nombre: '',
          cuello_de_botella: '',
          facturacion_mensual: '',
          email: '',
          pais_indicador: '+57',
          whatsapp_numero: '',
        });
      }, 500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = 4;
  const progressPercentage = ((step - 1) / totalSteps) * 100;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si no es el último paso, avanzar
    if (step < totalSteps) {
      handleNext();
      return;
    }

    setIsSubmitting(true);

    // Estructura del JSON para n8n
    const payload = {
      nombre: formData.nombre,
      cuello_de_botella: formData.cuello_de_botella,
      facturacion_mensual: formData.facturacion_mensual,
      email: formData.email,
      telefono_completo: `${formData.pais_indicador} ${formData.whatsapp_numero}`
    };

    try {
      const response = await fetch('https://teamnext.app.n8n.cloud/webhook/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        console.error('Error en n8n');
        setIsSuccess(true); // UX: mostrar éxito aunque falle el webhook para evitar frustración
      }
    } catch (error) {
      console.error('Error de red:', error);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-[15px] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[95%] max-w-md bg-zinc-900/60 border-[0.5px] border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
        >
          {!isSuccess && (
            <button onClick={onClose} className="absolute top-5 right-5 z-20 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          )}

          {!isSuccess && (
            <div className="w-full h-[2px] bg-zinc-800 absolute top-0 left-0 z-20">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <div className="p-6 md:p-10 pt-12 relative z-10">
            {isSuccess ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-6">
                <div className="w-20 h-20 mb-6 flex items-center justify-center">
                  <svg className="w-full h-full text-white" viewBox="0 0 50 50">
                    <motion.circle cx="25" cy="25" r="23" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                    <motion.path d="M15 25L22 32L35 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">¡Solicitud enviada, {formData.nombre}!</h3>
                <p className="text-gray-400 text-sm">
                  Analizaremos tu caso personalmente. Nos pondremos en contacto contigo por WhatsApp en menos de 24 horas.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                      <label className="text-2xl font-medium text-white">¿Cómo te llamas?</label>
                      <input
                        type="text"
                        autoFocus
                        value={formData.nombre}
                        onChange={(e) => updateField('nombre', e.target.value)}
                        placeholder="Tu nombre aquí"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                        required
                      />
                      <button type="button" onClick={handleNext} disabled={!formData.nombre} className="mt-4 py-4 rounded-full bg-white text-black font-semibold disabled:opacity-50 transition-all">Continuar</button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
                      <label className="text-xl md:text-2xl font-medium text-white">¿Cuál es el principal cuello de botella de tu formación?</label>
                      <div className="flex flex-col gap-3">
                        {['Leads desaparecen', 'Caos en WhatsApp', 'Dependencia de IG', 'No puedo escalar'].map((option) => (
                          <label key={option} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.cuello_de_botella === option ? 'border-white/40 bg-white/5' : 'border-white/5 bg-black/30 hover:bg-white/5'}`}>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.cuello_de_botella === option ? 'border-white' : 'border-gray-600'}`}>
                              {formData.cuello_de_botella === option && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <input type="radio" name="bottleneck" value={option} className="hidden" onChange={(e) => { updateField('cuello_de_botella', e.target.value); setTimeout(handleNext, 300); }} />
                            <span className="text-gray-200">{option}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
                      <label className="text-2xl font-medium text-white">¿Rango de facturación mensual?</label>
                      <div className="flex flex-col gap-3">
                        {['<$1k', '$1k-$5k', '$5k-$15k', '>$15k'].map((option) => (
                          <label key={option} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.facturacion_mensual === option ? 'border-white/40 bg-white/5' : 'border-white/5 bg-black/30 hover:bg-white/5'}`}>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.facturacion_mensual === option ? 'border-white' : 'border-gray-600'}`}>
                              {formData.facturacion_mensual === option && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <input type="radio" name="revenue" value={option} className="hidden" onChange={(e) => { updateField('facturacion_mensual', e.target.value); setTimeout(handleNext, 300); }} />
                            <span className="text-gray-200">{option}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                      <label className="text-2xl font-medium text-white">Datos de contacto</label>
                      <div className="space-y-4">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="Email profesional"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/30"
                          required
                        />
                        <div className="flex gap-3">
                          <div className="w-20 flex items-center justify-center bg-black/40 border border-white/10 rounded-xl text-white font-medium">
                            {formData.pais_indicador}
                          </div>
                          <input
                            type="tel"
                            value={formData.whatsapp_numero}
                            onChange={(e) => updateField('whatsapp_numero', e.target.value)}
                            placeholder="WhatsApp"
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/30"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.email || !formData.whatsapp_numero}
                        className="mt-2 w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all flex justify-center items-center gap-2"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
