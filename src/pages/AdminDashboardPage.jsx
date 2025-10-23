
    import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';
    import { BarChart, Users, FileText, ShieldCheck, Mail, LogOut } from 'lucide-react';

    const AdminDashboardPage = () => {
        const { toast } = useToast();

        const handleNotImplemented = () => {
            toast({
                title: "🚧 Fonctionnalité en cours de développement",
                description: "Cette section sera bientôt disponible !",
            });
        };

        return (
            <>
                <Helmet>
                    <title>Tableau de bord Admin - MBOA PLACE</title>
                    <meta name="description" content="Administration de la plateforme MBOA PLACE." />
                </Helmet>
                <div className="flex min-h-screen bg-gray-100">
                    <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
                        <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
                            Admin MBOA
                        </div>
                        <nav className="mt-6">
                            <Link to="/admin" className="flex items-center px-6 py-3 bg-gray-700 text-white">
                                <BarChart className="mr-3" />
                                Tableau de bord
                            </Link>
                            <button onClick={handleNotImplemented} className="w-full text-left flex items-center px-6 py-3 hover:bg-gray-700">
                                <FileText className="mr-3" />
                                Gestion annonces
                            </button>
                            <button onClick={handleNotImplemented} className="w-full text-left flex items-center px-6 py-3 hover:bg-gray-700">
                                <Users className="mr-3" />
                                Gestion utilisateurs
                            </button>
                            <button onClick={handleNotImplemented} className="w-full text-left flex items-center px-6 py-3 hover:bg-gray-700">
                                <ShieldCheck className="mr-3" />
                                Demandes de vérif.
                            </button>
                             <button onClick={handleNotImplemented} className="w-full text-left flex items-center px-6 py-3 hover:bg-gray-700">
                                <Mail className="mr-3" />
                                Messagerie
                            </button>
                        </nav>
                        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
                            <Link to="/" className="flex items-center px-6 py-3 hover:bg-gray-700">
                                <LogOut className="mr-3 rotate-180" />
                                Retour au site
                            </Link>
                        </div>
                    </aside>
                    <main className="flex-1 p-10">
                        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Administrateur</h1>
                        <p className="text-gray-600 mt-2">Bienvenue dans votre centre de commande.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-500">Utilisateurs inscrits</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">À venir</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-500">Annonces actives</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">À venir</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-500">Vérifications en attente</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">À venir</p>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-500">Revenus générés</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">0 CAD</p>
                            </div>
                        </div>

                        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">Fonctionnalités à venir</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Tableau détaillé de gestion des annonces (supprimer, suspendre).</li>
                                <li>Tableau de gestion des utilisateurs (bannir, promouvoir admin).</li>
                                <li>Interface de validation des pièces d'identité et selfies.</li>
                                <li>Statistiques avancées sur la croissance et l'engagement.</li>
                            </ul>
                        </div>
                    </main>
                </div>
            </>
        );
    };

    export default AdminDashboardPage;
  