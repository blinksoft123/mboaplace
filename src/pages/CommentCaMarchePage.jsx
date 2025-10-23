
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Image, MessageCircle, Search, Phone, CheckCircle, DollarSign, Plane, ShoppingBag, Home, Briefcase, Shield } from 'lucide-react';

const CommentCaMarchePage = () => {
  return (
    <>
      <Helmet>
        <title>Comment ça marche - MBOA PLACE</title>
        <meta name="description" content="Découvrez comment utiliser MBOA PLACE pour acheter, vendre et échanger" />
      </Helmet>

      <div className="bg-gray-50">
        <div className="gradient-green text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Comment fonctionne MBOA PLACE ?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl"
            >
              Simple, rapide et sécurisé
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Pour les vendeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-[#1B5E20] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">1. Publiez</h3>
                <p className="text-gray-600 mb-4">Créez votre annonce en 2 minutes, c'est 100% gratuit</p>
                <Link to="/publier" className="text-[#FF6F00] font-semibold hover:underline">
                  Commencer à vendre →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-[#FF6F00] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Image size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">2. Ajoutez</h3>
                <p className="text-gray-600 mb-4">Photos et description détaillée pour attirer les acheteurs</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-[#1B5E20] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">3. Échangez</h3>
                <p className="text-gray-600 mb-4">Contact direct par WhatsApp ou email avec les acheteurs</p>
              </motion.div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Pour les acheteurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">1. Cherchez</h3>
                <p className="text-gray-600 mb-4">Par catégorie ou mot-clé pour trouver votre bonheur</p>
                <Link to="/categories" className="text-[#FF6F00] font-semibold hover:underline">
                  Parcourir les annonces →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">2. Contactez</h3>
                <p className="text-gray-600 mb-4">Posez des questions au vendeur pour vous rassurer</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">3. Finalisez</h3>
                <p className="text-gray-600 mb-4">Rencontrez le vendeur dans un lieu sûr pour conclure</p>
              </motion.div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
              {[
                { icon: DollarSign, title: 'Échanges' },
                { icon: Plane, title: 'Colis' },
                { icon: ShoppingBag, title: 'Commerce' },
                { icon: Home, title: 'Immobilier' },
                { icon: Briefcase, title: 'Emploi' }
              ].map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <cat.icon size={32} className="mx-auto mb-3 text-[#1B5E20]" />
                  <h4 className="font-semibold">{cat.title}</h4>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Conseils Sécurité</h2>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield size={48} className="text-red-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <span>Privilégiez les rencontres dans des lieux publics et fréquentés.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <span>Vérifiez le profil et les avis des autres utilisateurs.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <span>Ne payez jamais d'avance, surtout à des inconnus.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <span>Signalez tout comportement suspect à notre équipe.</span>
                    </li>
                  </ul>
                  <Link to="/securite" className="mt-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition">
                    Voir le guide complet →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-orange text-white rounded-xl shadow-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl mb-8">Rejoignez des milliers de membres de la communauté dès aujourd'hui.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inscription" className="bg-white text-[#1B5E20] px-8 py-4 rounded-lg font-bold text-lg transition hover:bg-gray-100">
                Créer un compte
              </Link>
              <Link to="/publier" className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-8 py-4 rounded-lg font-bold text-lg transition">
                Publier une annonce
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CommentCaMarchePage;
