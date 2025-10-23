
    import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Users, Banknote, Package, Flag, AlertTriangle, Eye, Lock, FileWarning, HeartHandshake as Handshake, CheckSquare } from 'lucide-react';

const SecuritePage = () => {
  return (
    <>
      <Helmet>
        <title>Conseils Sécurité - MBOA PLACE</title>
        <meta name="description" content="Nos conseils pour des transactions sécurisées sur MBOA PLACE." />
      </Helmet>

      <div className="bg-gray-50">
        <div className="bg-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4"
            >
              <Shield size={48} />
              <h1 className="text-4xl md:text-5xl font-bold">Votre sécurité avant tout</h1>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-green-100 border-l-4 border-green-500 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Avant la rencontre</h2>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start space-x-3"><Eye size={20} className="mt-1 flex-shrink-0" /><span>Vérifiez le profil du vendeur, ses avis et la date de création de son compte.</span></li>
                <li className="flex items-start space-x-3"><Lock size={20} className="mt-1 flex-shrink-0" /><span>Gardez toutes vos conversations sur la messagerie de MBOA PLACE.</span></li>
                <li className="flex items-start space-x-3"><AlertTriangle size={20} className="mt-1 flex-shrink-0" /><span>Ne partagez jamais vos informations bancaires ou personnelles.</span></li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-orange-100 border-l-4 border-orange-500 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">Pendant la rencontre</h2>
              <ul className="space-y-3 text-orange-700">
                <li className="flex items-start space-x-3"><Users size={20} className="mt-1 flex-shrink-0" /><span>Privilégiez les lieux publics, en journée, et si possible, soyez accompagné.</span></li>
                <li className="flex items-start space-x-3"><Package size={20} className="mt-1 flex-shrink-0" /><span>Vérifiez l'article avant de payer. Assurez-vous qu'il correspond à l'annonce.</span></li>
                <li className="flex items-start space-x-3"><CheckSquare size={20} className="mt-1 flex-shrink-0" /><span>Pour les services, payez de préférence une fois le service rendu et validé.</span></li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-blue-100 border-l-4 border-blue-500 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Spécial : Échanges de devises</h2>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-start space-x-3"><Banknote size={20} className="mt-1 flex-shrink-0" /><span>Pour un maximum de sécurité, rencontrez-vous dans une banque ou un bureau de change.</span></li>
                <li className="flex items-start space-x-3"><Handshake size={20} className="mt-1 flex-shrink-0" /><span>Privilégiez la remise en main propre uniquement avec les profils vérifiés sur MBOA PLACE.</span></li>
                 <li className="flex items-start space-x-3"><FileWarning size={20} className="mt-1 flex-shrink-0" /><span>Au Cameroun, privilégiez les dépôts bancaires avec un reçu comme preuve de transaction.</span></li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-red-100 border-l-4 border-red-500 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-red-800 mb-4">Signaler un problème</h2>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start space-x-3"><Flag size={20} className="mt-1 flex-shrink-0" /><span>Utilisez le bouton "Signaler" sur l'annonce ou le profil si quelque chose vous semble suspect.</span></li>
                <li className="flex items-start space-x-3"><FileWarning size={20} className="mt-1 flex-shrink-0" /><span>Notre équipe examine chaque signalement sous 24h et prend les mesures nécessaires.</span></li>
              </ul>
            </motion.div>

            <div className="text-center pt-8">
              <p className="text-lg text-gray-700">Votre confiance est notre priorité. Ensemble, créons un environnement sûr.</p>
              <p className="text-lg text-gray-700">Pour toute question, contactez-nous à <a href="mailto:support@mboaplace.com" className="font-semibold text-[#1B5E20] hover:underline">support@mboaplace.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecuritePage;
  