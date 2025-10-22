import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start sm:items-center mb-4 gap-3 sm:gap-4">
          <div className="bg-red-100 rounded-full p-2 sm:p-3 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">Delete Interview</h3>
        </div>
        
        <p className="text-sm sm:text-base text-gray-600 mb-6 ml-0 sm:ml-14">
          Are you sure you want to delete this interview? This action cannot be undone.
        </p>
        
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;