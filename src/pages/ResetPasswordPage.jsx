
    import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';

    const ResetPasswordPage = () => {
      const { toast } = useToast();

      const handleNotImplemented = (e) => {
        e.preventDefault();
        toast({
          title: "✅ Email envoyé !",
          description: "Si un compte existe pour cet email, vous recevrez un lien de réinitialisation.",
        });
      };

      return (
        <>
          <Helmet>
            <title>Réinitialiser le mot de passe - MBOA PLACE</title>
            <meta name="description" content="Réinitialisez votre mot de passe MBOA PLACE." />
          </Helmet>
          <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Réinitialiser mon mot de passe</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Entrez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleNotImplemented}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Adresse email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B5E20] hover:bg-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B5E20]"
                    >
                      ENVOYER LE LIEN
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        <Link to="/connexion" className="font-medium text-[#1B5E20] hover:text-[#2E7D32]">
                          &larr; Retour à la connexion
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };

    export default ResetPasswordPage;
  