
    import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b">
      <button
        className="flex justify-between items-center w-full py-5 text-left"
        onClick={onClick}
      >
        <span className="text-lg font-semibold text-gray-800">{question}</span>
        {isOpen ? <ChevronUp className="text-[#1B5E20]" /> : <ChevronDown className="text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-4 text-gray-600">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "1. Qu’est-ce que MBOA PLACE ?",
      answer: "MBOA PLACE est une plateforme de petites annonces communautaires dédiée à la diaspora africaine. C’est l’endroit idéal pour acheter, vendre, louer, recruter ou recommander au sein d’une même communauté, dans un esprit de confiance et de solidarité."
    },
    {
      question: "2. À qui s’adresse MBOA PLACE ?",
      answer: "MBOA PLACE s’adresse à tous les Africains et Afrodescendants, qu’ils vivent sur le continent ou à l’étranger. Que vous soyez étudiant, entrepreneur, travailleur ou nouvel arrivant, la plateforme est là pour vous aider à trouver ou partager des opportunités dans votre ville ou votre pays de résidence."
    },
    {
      question: "3. Comment publier une annonce ?",
      answer: (
        <ol className="list-decimal list-inside space-y-2">
          <li>Créez un compte gratuit sur MBOA PLACE.</li>
          <li>Cliquez sur “Publier une annonce”.</li>
          <li>Choisissez la catégorie (emploi, logement, services, etc.).</li>
          <li>Ajoutez une photo, un titre et une description claire.</li>
          <li>Validez votre annonce : elle sera publiée après vérification.</li>
        </ol>
      )
    },
    {
      question: "4. Est-ce que MBOA PLACE est gratuit ?",
      answer: "✅ Oui, l’inscription et la publication d’annonces de base sont gratuites. Des options premium seront bientôt disponibles pour mettre vos annonces en avant et leur donner plus de visibilité."
    },
    {
      question: "5. Comment garantir la sécurité des annonces ?",
      answer: "Nous appliquons une modération manuelle et automatique des annonces. Chaque publication est vérifiée avant sa mise en ligne pour prévenir les fraudes. De plus, nous recommandons toujours d’échanger directement sur la plateforme avant toute transaction."
    },
    {
      question: "6. Dans quels pays MBOA PLACE est-il disponible ?",
      answer: "MBOA PLACE est accessible partout dans le monde 🌍, mais nous mettons l’accent sur des zones comme le Canada 🇨🇦, la France 🇫🇷, la Belgique 🇧🇪, la Côte d’Ivoire 🇨🇮, le Cameroun 🇨🇲, le Sénégal 🇸🇳 et d'autres à venir."
    },
    {
      question: "7. Puis-je publier une annonce professionnelle ou commerciale ?",
      answer: "Oui ! Les entreprises, associations et auto-entrepreneurs peuvent aussi publier leurs annonces pour recruter, promouvoir leurs produits ou trouver des partenaires. Des comptes “Pro” seront bientôt disponibles."
    },
    {
      question: "8. Comment signaler une annonce suspecte ?",
      answer: "Si vous remarquez une annonce douteuse, cliquez simplement sur “Signaler” en bas de l’annonce. Notre équipe analysera le contenu et prendra les mesures nécessaires pour protéger la communauté."
    },
    {
      question: "9. Comment contacter l’équipe MBOA PLACE ?",
      answer: (
        <p>
          Vous pouvez nous écrire à :{' '}
          <a href="mailto:contact@mboaplace.com" className="text-[#1B5E20] font-semibold hover:underline">contact@mboaplace.com</a>{' '}
          ou via notre page <Link to="/contact" className="text-[#1B5E20] font-semibold hover:underline">Contactez-nous</Link>.
        </p>
      )
    },
    {
      question: "10. Quelle est la vision à long terme de MBOA PLACE ?",
      answer: "Notre vision est de bâtir le plus grand écosystème digital afro-diasporique, où chaque membre peut trouver des opportunités, valoriser ses talents, créer des connexions utiles et soutenir l’économie africaine."
    }
  ];
  
  return (
    <>
      <Helmet>
        <title>FAQ - MBOA PLACE</title>
        <meta name="description" content="Foire aux questions de MBOA PLACE." />
      </Helmet>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">❓ Foire Aux Questions (FAQ)</h1>
            <p className="text-lg text-gray-600">Trouvez les réponses à vos questions les plus fréquentes.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
  