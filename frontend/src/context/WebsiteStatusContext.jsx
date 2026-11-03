import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { publicService } from '../services/api';

const WebsiteStatusContext = createContext(null);

export const WebsiteStatusProvider = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState({
    is_maintenance_mode: false,
    maintenance_title_en: "We'll Be Back Soon",
    maintenance_title_bn: 'আমরা শীঘ্রই ফিরে আসব',
    maintenance_title_hi: 'हम जल्द ही वापस आएंगे',
    maintenance_message_en: 'Seva Setu is temporarily unavailable while we carry out scheduled system maintenance. Please visit again soon.',
    maintenance_message_bn: 'তফসিলি রক্ষণাবেক্ষণের জন্য সেবা সেতু সাময়িকভাবে অনুপলব্ধ রয়েছে। অনুগ্রহ করে শীঘ্রই আবার পরিদর্শন করুন।',
    maintenance_message_hi: 'अनुसूचित रखरखाव के कारण सेवा सेतु अस्थायी रूप से अनुपलब्ध है। कृपया जल्द ही पुनः पधारें।',
    estimated_reopening_at: null,
    support_contact_email: 'support@sevasetu.org',
    updated_at: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await publicService.getWebsiteStatus();
      if (res.data && res.data.success) {
        setIsMaintenanceMode(Boolean(res.data.is_maintenance_mode));
        setMaintenanceData(res.data);
      }
    } catch (err) {
      // If endpoint returns 503 with maintenance info, activate maintenance mode
      if (err.response && err.response.status === 503 && err.response.data) {
        setIsMaintenanceMode(true);
        if (err.response.data.maintenance_title_en || err.response.data.maintenance_message_en) {
          setMaintenanceData(err.response.data);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // Periodic check every 60 seconds to detect site status changes
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Global Axios interceptor to catch 503 maintenance mode responses from any public API call
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 503 && error.response.data && error.response.data.maintenance) {
          setIsMaintenanceMode(true);
          setMaintenanceData((prev) => ({
            ...prev,
            ...error.response.data,
            is_maintenance_mode: true,
          }));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const setDirectStatus = (statusData) => {
    if (typeof statusData.is_maintenance_mode === 'boolean') {
      setIsMaintenanceMode(statusData.is_maintenance_mode);
    }
    setMaintenanceData((prev) => ({ ...prev, ...statusData }));
  };

  return (
    <WebsiteStatusContext.Provider
      value={{
        isMaintenanceMode,
        maintenanceData,
        loading,
        refreshStatus: fetchStatus,
        setDirectStatus,
      }}
    >
      {children}
    </WebsiteStatusContext.Provider>
  );
};

export const useWebsiteStatus = () => {
  const context = useContext(WebsiteStatusContext);
  if (!context) {
    throw new Error('useWebsiteStatus must be used within a WebsiteStatusProvider');
  }
  return context;
};

export default WebsiteStatusContext;

