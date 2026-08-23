import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-green-600" />
      </div>
      <p className="text-sm font-medium text-gray-900">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'No data found', description, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
