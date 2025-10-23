
    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Search, Menu, X, User, Plus } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import SearchModal from '@/components/SearchModal';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const Header = () => {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const [searchModalOpen, setSearchModalOpen] = useState(false);
      const { user } = useAuth();

      return (
        <>
          <header className="bg-white shadow-sm sticky top-0 z-50 h-[70px]">
            <div className="container mx-auto px-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-8 lg:space-x-12">
                  <button className="lg:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>

                  <Link to="/" className="flex items-center">
                     <span className="text-2xl font-bold text-green-800 tracking-tighter whitespace-nowrap">MBOA PLACE</span>
                  </Link>
                </div>

                <nav className="hidden lg:flex items-center space-x-8 ml-8">
                  <Link to="/" className="text-gray-700 hover:text-[#1B5E20] font-medium transition">
                    Accueil
                  </Link>
                  <Link to="/categories" className="text-gray-700 hover:text-[#1B5E20] font-medium transition">
                    Catégories
                  </Link>
                  <Link to="/comment-ca-marche" className="text-gray-700 hover:text-[#1B5E20] font-medium transition">
                    Comment ça marche
                  </Link>
                </nav>

                <div className="hidden lg:flex flex-1 justify-center px-8">
                  <div className="relative w-full max-w-md">
                    <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition" onFocus={() => setSearchModalOpen(true)} readOnly />
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                  <button onClick={() => setSearchModalOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition lg:hidden">
                    <Search size={20} className="text-gray-700" />
                  </button>

                  <Link to="/publier" className="hidden md:flex items-center space-x-2 bg-[#FF6F00] hover:bg-[#E65100] text-white px-4 py-2 rounded-full font-semibold transition">
                    <Plus size={20} />
                    <span>Publier une annonce</span>
                  </Link>

                  <Link to={user ? "/profil" : "/connexion"} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <User size={20} className="text-gray-700" />
                  </Link>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div initial={{ opacity: 0, x: '-100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '-100%' }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="lg:hidden fixed top-0 left-0 w-64 h-full bg-white shadow-2xl z-50">
                  <div className="p-4">
                    <button className="mb-8" onClick={() => setMobileMenuOpen(false)}>
                      <X size={24} />
                    </button>
                    <nav className="flex flex-col space-y-4">
                      <Link to="/" className="block py-2 text-gray-700 hover:text-[#1B5E20] font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Accueil
                      </Link>
                      <Link to="/categories" className="block py-2 text-gray-700 hover:text-[#1B5E20] font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Catégories
                      </Link>
                      <Link to="/comment-ca-marche" className="block py-2 text-gray-700 hover:text-[#1B5E20] font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Comment ça marche
                      </Link>
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {mobileMenuOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>}
          </header>

          <Link to="/publier" className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#FF6F00] hover:bg-[#E65100] rounded-full shadow-lg flex items-center justify-center z-40 transition">
            <Plus size={28} className="text-white" />
          </Link>

          <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
        </>
      );
    };

    export default Header;
  