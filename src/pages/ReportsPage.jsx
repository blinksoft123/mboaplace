import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const REASON_LABELS = {
  scam: '🚨 Arnaque ou fraude',
  inappropriate: '🔞 Contenu inapproprié',
  spam: '📧 Spam ou publicité',
  fake: '❌ Fausse annonce',
  duplicate: '📋 Doublon',
  other: '⚠️ Autre raison'
};

const STATUS_LABELS = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  reviewed: { label: 'Examiné', color: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejeté', color: 'bg-gray-100 text-gray-800' }
};

const ReportsPage = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('reports')
        .select(`
          *,
          reporter:profiles!reporter_id (full_name, avatar_url),
          annonces (id, title, user_id)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        queryBuilder = queryBuilder.eq('status', filter);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les signalements.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: 'Statut mis à jour',
        description: `Le signalement a été marqué comme ${STATUS_LABELS[newStatus].label.toLowerCase()}.`
      });

      fetchReports();
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut.'
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Gestion des signalements - MBOA PLACE Admin</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center mb-4">
              <AlertTriangle size={32} className="mr-3 text-red-500" />
              Gestion des signalements
            </h1>
            
            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Tous', count: reports.length },
                { value: 'pending', label: 'En attente' },
                { value: 'reviewed', label: 'Examinés' },
                { value: 'resolved', label: 'Résolus' },
                { value: 'rejected', label: 'Rejetés' }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === item.value
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun signalement</h2>
              <p className="text-gray-600">
                Il n'y a aucun signalement dans cette catégorie.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {report.reporter?.avatar_url ? (
                          <img
                            src={report.reporter.avatar_url}
                            alt={report.reporter.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold">
                            {report.reporter?.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {report.reporter?.full_name || 'Utilisateur'}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(report.created_at)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[report.status].color}`}>
                      {STATUS_LABELS[report.status].label}
                    </span>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="font-semibold text-red-800 mb-1">
                      {REASON_LABELS[report.reason] || report.reason}
                    </p>
                    {report.details && (
                      <p className="text-sm text-red-700">"{report.details}"</p>
                    )}
                  </div>

                  {report.annonces && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2">Annonce signalée :</p>
                      <Link
                        to={`/annonce/${report.annonce_id}`}
                        className="font-semibold text-[#1B5E20] hover:underline flex items-center space-x-2"
                      >
                        <Eye size={16} />
                        <span>#{report.annonce_id} - {report.annonces.title}</span>
                      </Link>
                    </div>
                  )}

                  {/* Actions */}
                  {report.status === 'pending' && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center space-x-2"
                      >
                        <Eye size={16} />
                        <span>Marquer comme examiné</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center space-x-2"
                      >
                        <CheckCircle size={16} />
                        <span>Résoudre</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'rejected')}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition flex items-center space-x-2"
                      >
                        <XCircle size={16} />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
