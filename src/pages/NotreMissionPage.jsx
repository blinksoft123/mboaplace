
    import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Briefcase, Home, ShoppingBag } from 'lucide-react';

const NotreMissionPage = () => {
    const offerings = [
        { icon: Briefcase, text: "Petites annonces locales et internationales (emploi, services, etc.)" },
        { icon: Home, text: "Offres de logement, colocation et hébergement temporaire" },
        { icon: ShoppingBag, text: "Espace communautaire pour créer des connexions entre membres" },
    ];

    return (
        <>
            <Helmet>
                <title>Notre Mission - MBOA PLACE</title>
                <meta name="description" content="Faciliter les échanges et opportunités au sein de la diaspora africaine, partout dans le monde." />
            </Helmet>
            <div className="bg-white">
                <header className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-20 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-block p-6 bg-white/20 rounded-full mb-6">
                        <Target size={48} />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-5xl font-bold">Notre Mission</motion.h1>
                </header>

                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="prose lg:prose-xl max-w-none text-gray-700 space-y-8">
                        <blockquote className="text-center text-3xl font-semibold italic border-none p-0">
                            “Faciliter les échanges et opportunités au sein de la diaspora africaine, partout dans le monde.”
                        </blockquote>
                        <p>
                            Nous croyons que chaque rencontre, chaque annonce, chaque service partagé peut contribuer à renforcer la solidarité et la réussite collective. MBOA PLACE est plus qu'une simple plateforme d'annonces ; c'est un outil pour construire des ponts, créer de la valeur et célébrer la richesse de notre communauté.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-8">
                            <h2 className="text-3xl font-bold mb-6 text-center">Ce que nous offrons</h2>
                            <div className="space-y-6">
                                {offerings.map((item, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-[#1B5E20] text-white rounded-full flex-shrink-0 flex items-center justify-center">
                                            <item.icon size={32} />
                                        </div>
                                        <p className="text-xl font-medium">{item.text}</p>
                                    </motion.div>
                                ))}
                                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-[#1B5E20] text-white rounded-full flex-shrink-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold">💚</span>
                                    </div>
                                    <p className="text-xl font-medium">Une plateforme 100% dédiée à la communauté africaine et afrodescendante</p>
                                </motion.div>
                            </div>
                        </div>

                         <div className="text-center py-12">
                           <Link to="/publier" className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-10 py-4 rounded-lg font-bold text-lg transition shadow-lg">
                                Publiez votre première annonce
                           </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotreMissionPage;
  