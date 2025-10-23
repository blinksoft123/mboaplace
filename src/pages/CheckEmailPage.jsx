
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';

const CheckEmailPage = () => {
  return (
    <>
      <Helmet>
        <title>Vérifiez votre e-mail - MBOA PLACE</title>
        <meta name="description" content="Veuillez vérifier votre boîte de réception pour confirmer votre compte MBOA PLACE." />
      </Helmet>
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg"
        >
          <div>
            <MailCheck className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Presque terminé !
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Nous vous avons envoyé un e-mail. Veuillez cliquer sur le lien à l'intérieur pour confirmer votre compte et finaliser votre inscription.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Pensez à vérifier votre dossier de courrier indésirable (spam).
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckEmailPage;
