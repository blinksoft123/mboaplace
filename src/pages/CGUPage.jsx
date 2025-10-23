
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const CGUPage = () => {
  return (
    <>
      <Helmet>
        <title>Conditions Générales d'Utilisation - MBOA PLACE</title>
        <meta name="description" content="Consultez les conditions générales d'utilisation de MBOA PLACE." />
      </Helmet>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h1 className="text-3xl font-bold mb-8 text-center">Conditions Générales d'Utilisation</h1>
            <div className="prose max-w-none text-gray-700 space-y-6">
              <p>Dernière mise à jour : 17 Octobre 2025</p>

              <h2 className="font-bold">1. Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles les utilisateurs peuvent accéder et utiliser la plateforme MBOA PLACE.
              </p>

              <h2 className="font-bold">2. Définitions</h2>
              <p>
                <strong>Utilisateur :</strong> toute personne physique ou morale qui accède et utilise la plateforme.<br />
                <strong>Annonce :</strong> toute offre de vente, de service, d'échange publiée par un utilisateur sur la plateforme.
              </p>

              <h2 className="font-bold">3. Accès et inscription</h2>
              <p>
                L'accès à la consultation des annonces est libre. La publication d'annonces requiert la création d'un compte gratuit. L'utilisateur s'engage à fournir des informations exactes et à les maintenir à jour.
              </p>

              <h2 className="font-bold">4. Publication des annonces</h2>
              <p>
                L'utilisateur est seul responsable du contenu de son annonce. Il s'engage à ce que celle-ci ne contrevienne pas à la législation en vigueur, aux bonnes mœurs et aux droits des tiers.
              </p>

              <h2 className="font-bold">5. Responsabilités</h2>
              <p className="font-bold text-red-600 bg-red-50 p-4 rounded-md border border-red-200">
                MBOA PLACE est un simple intermédiaire qui met en relation des utilisateurs. La plateforme ne gère ni les paiements ni les livraisons. Les transactions se font directement entre utilisateurs, sous leur seule et entière responsabilité. MBOA PLACE ne peut être tenu responsable en cas de litige entre utilisateurs.
              </p>

              <h2 className="font-bold">6. Contenu interdit</h2>
              <p>
                Il est interdit de publier du contenu illégal, contrefait, discriminatoire, offensant, ou faisant la promotion d'activités illégales. MBOA PLACE se réserve le droit de supprimer toute annonce non conforme sans préavis.
              </p>

              <h2 className="font-bold">7. Propriété intellectuelle</h2>
              <p>
                Les contenus publiés par les utilisateurs restent leur propriété. En publiant une annonce, l'utilisateur concède à MBOA PLACE une licence non-exclusive, mondiale et gratuite pour utiliser, reproduire et diffuser ce contenu.
              </p>

              <h2 className="font-bold">8. Données personnelles</h2>
              <p>
                MBOA PLACE s'engage à protéger les données personnelles de ses utilisateurs conformément à sa Politique de Confidentialité.
              </p>

              <h2 className="font-bold">9. Modification / Résiliation</h2>
              <p>
                MBOA PLACE se réserve le droit de modifier à tout moment les présentes CGU. L'utilisateur peut à tout moment résilier son compte.
              </p>

              <h2 className="font-bold">10. Loi applicable</h2>
              <p>
                Les présentes CGU sont soumises au droit canadien. Tout litige sera de la compétence exclusive des tribunaux de Montréal, Québec.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CGUPage;
