
    import React, { useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { Link, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { CheckCircle } from 'lucide-react';

    const ConfirmationPage = () => {
      const navigate = useNavigate();

      useEffect(() => {
        const timer = setTimeout(() => {
          navigate('/connexion', { replace: true });
        }, 3000);

        return () => clearTimeout(timer);
      }, [navigate]);

      return (
        <>
          <Helmet>
            <title>Compte confirmé - MBOA PLACE</title>
            <meta name="description" content="Votre compte a été confirmé avec succès." />
          </Helmet>
          <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg"
            >
              <div>
                <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Votre adresse e-mail a été confirmée avec succès.
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Vous pouvez maintenant vous connecter. Vous allez être redirigé...
                </p>
              </div>
              <div>
                <Link
                  to="/connexion"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B5E20] hover:bg-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Se connecter maintenant
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      );
    };

    export default ConfirmationPage;
  