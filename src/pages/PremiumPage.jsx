
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Gem, Zap, Rocket, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PremiumPage = () => {
  const { toast } = useToast();

  const handleChoosePlan = () => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain message ! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>MBOA PLACE Premium - Boostez vos ventes</title>
        <meta name="description" content="Découvrez les avantages de MBOA PLACE Premium pour plus de visibilité et de résultats." />
      </Helmet>

      <div className="bg-gray-50">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Gem size={48} className="mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Passez Premium et boostez vos ventes</h1>
              <p className="text-xl">Plus de visibilité, plus de fonctionnalités, plus de résultats.</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Choisissez votre plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-8 text-center flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-2">Mensuel</h3>
                <p className="text-4xl font-extrabold mb-4">10<span className="text-lg font-medium"> CAD/mois</span></p>
                <ul className="space-y-3 text-left mb-8 flex-grow">
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Annonces illimitées</span></li>
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Badge vérifié</span></li>
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Remontée automatique</span></li>
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Sans engagement</span></li>
                </ul>
                <button onClick={handleChoosePlan} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition">Choisir</button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border-2 border-[#1B5E20] rounded-xl shadow-2xl p-8 text-center flex flex-col relative"
              >
                <div className="absolute top-0 -translate-y-1/2 w-full left-0">
                  <span className="bg-[#1B5E20] text-white px-4 py-1 rounded-full text-sm font-semibold">Le plus populaire</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Annuel</h3>
                <p className="text-4xl font-extrabold mb-4">100<span className="text-lg font-medium"> CAD/an</span></p>
                <p className="text-green-600 font-semibold mb-4">Économisez 20% (2 mois gratuits !)</p>
                <ul className="space-y-3 text-left mb-8 flex-grow">
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Tous les avantages Mensuel</span></li>
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Badge VIP 👑</span></li>
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Support prioritaire</span></li>
                  <li className="flex items-center space-x-3"><Check size={20} className="text-green-500" /><span>Accès avant-première</span></li>
                </ul>
                <button onClick={handleChoosePlan} className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-lg font-bold transition">Choisir</button>
              </motion.div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Services à la carte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <Rocket size={32} className="text-[#FF6F00] mb-4" />
                <h3 className="text-xl font-bold mb-2">Boost Standard - 5$</h3>
                <p className="text-gray-600">Top catégorie pendant 7 jours, badge vedette, +200% de vues.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <Zap size={32} className="text-[#FF6F00] mb-4" />
                <h3 className="text-xl font-bold mb-2">Boost Premium - 10$</h3>
                <p className="text-gray-600">Top page d'accueil pendant 7 jours, notifications push, +400% de vues.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <Image size={32} className="text-[#FF6F00] mb-4" />
                <h3 className="text-xl font-bold mb-2">Photos illimitées - 2$</h3>
                <p className="text-gray-600">Ajoutez autant de photos que vous voulez à votre annonce.</p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-orange text-white rounded-xl shadow-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à passer au niveau supérieur ?</h2>
            <p className="text-xl mb-8">Devenez Premium dès maintenant et multipliez vos chances de succès.</p>
            <button onClick={handleChoosePlan} className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-8 py-4 rounded-lg font-bold text-lg transition">DEVENIR PREMIUM</button>
          </section>
        </div>
      </div>
    </>
  );
};

export default PremiumPage;
