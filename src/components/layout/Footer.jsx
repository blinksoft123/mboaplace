
    import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C2C2C] text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="text-lg font-bold text-white">À propos</span>
            <ul className="mt-4 space-y-2">
              <li><Link to="/qui-sommes-nous" className="hover:text-white transition">Qui sommes-nous</Link></li>
              <li><Link to="/notre-mission" className="hover:text-white transition">Notre mission</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-bold text-white">Catégories populaires</span>
            <ul className="mt-4 space-y-2">
              <li><Link to="/categorie/echanges-transferts" className="hover:text-white transition">Échanges et transferts</Link></li>
              <li><Link to="/categorie/colis-voyages" className="hover:text-white transition">Colis et voyages</Link></li>
              <li><Link to="/categorie/commerce" className="hover:text-white transition">Commerce</Link></li>
              <li><Link to="/categorie/immobilier" className="hover:text-white transition">Immobilier</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-bold text-white">Aide & Support</span>
            <ul className="mt-4 space-y-2">
              <li><Link to="/comment-ca-marche" className="hover:text-white transition">Comment ça marche</Link></li>
              <li><Link to="/securite" className="hover:text-white transition">Conseils de sécurité</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/cgu" className="hover:text-white transition">CGU</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-bold text-white">Suivez-nous</span>
            <div className="mt-4 flex flex-col space-y-3">
              <a href="#" className="flex items-center space-x-2 hover:text-white transition"><Facebook size={20} /><span>Facebook</span></a>
              <a href="#" className="flex items-center space-x-2 hover:text-white transition"><Instagram size={20} /><span>Instagram</span></a>
              <a href="mailto:support@mboaplace.com" className="flex items-center space-x-2 hover:text-white transition"><Mail size={20} /><span>Email</span></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>Copyright © 2025 MBOA PLACE - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  