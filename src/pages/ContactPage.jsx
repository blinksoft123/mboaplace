
    import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "✅ Message envoyé !",
      description: "Merci, nous vous répondrons dans les plus brefs délais.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact - MBOA PLACE</title>
        <meta name="description" content="Contactez l'équipe de MBOA PLACE." />
      </Helmet>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-lg text-gray-600">Une question ? Une suggestion ? Nous sommes là pour vous aider.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-xl shadow-lg overflow-hidden">
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
              onSubmit={handleSubmit}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]">
                    <option>Question</option>
                    <option>Problème technique</option>
                    <option>Signalement</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows="5" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]"></textarea>
                </div>
                <div>
                  <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-4 rounded-lg font-bold text-lg transition">
                    <Send size={20} />
                    <span>ENVOYER</span>
                  </button>
                </div>
              </div>
            </motion.form>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative hidden lg:block"
            >
              <img src="https://horizons-cdn.hostinger.com/f2897423-192d-4a23-9582-daae7dc593d2/f14fba9f03184c15af1509e936a28fcb.png" alt="Happy team working together" className="absolute h-full w-full object-cover"/>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
  