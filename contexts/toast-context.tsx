import { Toast } from '@/components/ui/toast';
import { MenuItem } from '@/types/menu.types';
import React, { createContext, useContext, useState } from 'react';

interface ToastContextType {
  showToast: (items: MenuItem[], totalItems: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastItems, setToastItems] = useState<MenuItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const showToast = (items: MenuItem[], total: number) => {
    setToastItems(items);
    setTotalItems(total);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={toastVisible}
        onClose={hideToast}
        items={toastItems}
        totalItems={totalItems}
      />
    </ToastContext.Provider>
  );
};