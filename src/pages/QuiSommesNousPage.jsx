
    import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Globe, Target, Lightbulb } from 'lucide-react';

const QuiSommesNousPage = () => {
    return (
        <>
            <Helmet>
                <title>Qui sommes-nous ? - MBOA PLACE</title>
                <meta name="description" content="Découvrez MBOA PLACE, la plateforme des Africains d’ici et d’ailleurs." />
            </Helmet>
            <div className="bg-white">
                <header className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-20 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold">Qui sommes-nous ?</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl mt-4">🌍 MBOA PLACE, la plateforme des Africains d’ici et d’ailleurs</motion.p>
                </header>

                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="prose lg:prose-xl max-w-none text-gray-700 space-y-8">
                        <p className="lead">
                            MBOA PLACE est une plateforme de petites annonces communautaires créée pour et par la diaspora africaine. Notre mission est simple : connecter les Africains du monde entier à travers un espace convivial où chacun peut acheter, vendre, échanger, recommander et partager au sein d’une même communauté.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-8">
                            <h2 className="flex items-center text-3xl font-bold mb-4"><Users className="mr-3 text-[#1B5E20]" size={36}/>Une communauté avant tout</h2>
                            <p>
                                Ici, nous croyons à la force du lien communautaire. Que vous viviez à Montréal, Paris, Bruxelles, Abidjan, Douala ou Dakar, MBOA PLACE vous rapproche de vos frères et sœurs de la diaspora. Vous y trouverez des petites annonces fiables et authentiques, postées par des membres comme vous — qu’il s’agisse d’un emploi, d’un logement, d’un service, ou d’un bon plan.
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-8">
                            <h2 className="flex items-center text-3xl font-bold mb-4"><Lightbulb className="mr-3 text-[#FF6F00]" size={36}/>Notre vision</h2>
                            <p>
                                Créer un écosystème digital africain solidaire, où la technologie sert la communauté. MBOA PLACE veut devenir le carrefour des opportunités africaines, un lieu où chaque membre peut valoriser son savoir-faire, ses produits et ses services, tout en soutenant l’économie afro-diasporique.
                            </p>
                        </div>

                        <div className="text-center py-12">
                           <Link to="/inscription" className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-10 py-4 rounded-lg font-bold text-lg transition shadow-lg">
                                ❤️ Rejoignez le mouvement MBOA PLACE
                           </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default QuiSommesNousPage;
  