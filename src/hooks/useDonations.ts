import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Donation, DonationFormData } from '../types';

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDonations();
      if (response.success && response.data) {
        setDonations(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch donations');
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const createDonation = async (data: DonationFormData) => {
    try {
      const response = await api.createDonation(data);
      if (response.success && response.data) {
        setDonations((prev) => [response.data!, ...prev]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create donation');
    } catch (err) {
      console.error('Failed to create donation:', err);
      throw err;
    }
  };

  const updateDonation = async (id: string, data: Partial<Donation>) => {
    try {
      const response = await api.updateDonation(id, data);
      if (response.success && response.data) {
        setDonations((prev) =>
          prev.map((d) => (d.id === id ? response.data! : d))
        );
        return response.data;
      }
      throw new Error(response.message || 'Failed to update donation');
    } catch (err) {
      console.error('Failed to update donation:', err);
      throw err;
    }
  };

  const deleteDonation = async (id: string) => {
    try {
      const response = await api.deleteDonation(id);
      if (response.success) {
        setDonations((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete donation:', err);
      throw err;
    }
  };

  const approveDonation = async (id: string) => {
    try {
      const response = await api.approveDonation(id);
      if (response.success && response.data) {
        setDonations((prev) =>
          prev.map((d) => (d.id === id ? response.data! : d))
        );
        return response.data;
      }
      throw new Error(response.message || 'Failed to approve donation');
    } catch (err) {
      console.error('Failed to approve donation:', err);
      throw err;
    }
  };

  const completeDonation = async (id: string) => {
    try {
      const response = await api.completeDonation(id);
      if (response.success && response.data) {
        setDonations((prev) =>
          prev.map((d) => (d.id === id ? response.data! : d))
        );
        return response.data;
      }
      throw new Error(response.message || 'Failed to complete donation');
    } catch (err) {
      console.error('Failed to complete donation:', err);
      throw err;
    }
  };

  const refetch = () => {
    fetchDonations();
  };

  return {
    donations,
    loading,
    error,
    createDonation,
    updateDonation,
    deleteDonation,
    approveDonation,
    completeDonation,
    refetch,
  };
};
