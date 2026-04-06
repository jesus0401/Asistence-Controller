// src/api/useApi.js
// Hook genérico para manejar estado de llamadas a la API
// Uso: const { data, loading, error, execute } = useApi(fn, { autoRun: true })

import { useState, useEffect, useCallback } from "react";

export function useApi(apiFn, { autoRun = false, params = [] } = {}) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(autoRun);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (e) {
      setError(e.message || "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]); // eslint-disable-line

  useEffect(() => {
    if (autoRun) execute(...params);
  }, []); // eslint-disable-line

  return { data, loading, error, execute, setData };
}

// Hook específico para mutaciones (POST, PUT, DELETE)
export function useMutation(apiFn) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      return { success: true, data: result };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  }, [apiFn]); // eslint-disable-line

  return { mutate, loading, error };
}
