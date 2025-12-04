'use client';

import { useToastState } from '@/hooks/useToast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToastState();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const variantStyles = {
          default: 'bg-white border-slate-200',
          success: 'bg-green-50 border-green-500',
          error: 'bg-red-50 border-red-500',
          warning: 'bg-amber-50 border-amber-500',
        };

        const Icon = {
          default: Info,
          success: CheckCircle2,
          error: AlertCircle,
          warning: AlertCircle,
        }[toast.variant || 'default'];

        const iconColor = {
          default: 'text-slate-600',
          success: 'text-green-600',
          error: 'text-red-600',
          warning: 'text-amber-600',
        }[toast.variant || 'default'];

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg animate-in slide-in-from-right-full",
              variantStyles[toast.variant || 'default']
            )}
          >
            <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconColor)} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="font-semibold text-slate-900 text-sm mb-1">
                  {toast.title}
                </p>
              )}
              {toast.description && (
                <p className="text-sm text-slate-600">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

