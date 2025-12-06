/**
 * Global toast component using Sonner.
 * Provides success, error, loading, and custom toasts.
 */

import { toast } from 'sonner';

export interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showToast = {
  /**
   * Show success toast.
   */
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration ?? 3000,
      action: options?.action,
    });
  },

  /**
   * Show error toast.
   */
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration ?? 4000,
      action: options?.action,
    });
  },

  /**
   * Show info toast.
   */
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration ?? 3000,
      action: options?.action,
    });
  },

  /**
   * Show loading toast.
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast by ID.
   */
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts.
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

// Export Sonner's Toaster component for app-level setup
export { Toaster } from 'sonner';
