import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MapPin, CheckCircle, Clock, XCircle, AlertTriangle, X } from 'lucide-react';
import AuthContext from '@/app/context/AuthContext';

function AllocationStatus({ setCurrentPage }) {
  const { user } = useContext(AuthContext);
  const [currentRequest, setCurrentRequest] = useState(null);

  useEffect(() => {
    loadCurrentRequest();
  }, []);

  const loadCurrentRequest = () => {
    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    const request = requests.find(
      req => req.userEmail === user.email && (req.status === 'REQUESTED' || req.status === 'ALLOCATED' || req.status === 'OCCUPIED')
    );
    setCurrentRequest(request);
  };

  const handleCancel = () => {
    if (!currentRequest) return;

    const requests = JSON.parse(localStorage.getItem('parkingRequests') || '[]');
    const updatedRequests = requests.map(req => {
      if (req.id === currentRequest.id) {
        return { ...req, status: 'CANCELLED' };
      }
      return req;
    });
    localStorage.setItem('parkingRequests', JSON.stringify(updatedRequests));

    toast.success('Parking request cancelled');
    setCurrentRequest(null);
    setTimeout(() => {
      setCurrentPage('user-dashboard');
    }, 1500);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'REQUESTED':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          borderColor: 'border-yellow-500',
          label: 'Pending',
        };
      case 'ALLOCATED':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          borderColor: 'border-green-500',
          label: 'Allocated',
        };
      case 'OCCUPIED':
        return {
          icon: MapPin,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          borderColor: 'border-blue-500',
          label: 'Occupied',
        };
      case 'CANCELLED':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          borderColor: 'border-red-500',
          label: 'Cancelled',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          borderColor: 'border-gray-500',
          label: 'Unknown',
        };
    }
  };

  if (!currentRequest) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div
            className="bg-white dark:bg-[#1E293B] rounded-xl shadow-lg p-12 text-center"
            data-aos="fade-up"
          >
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Active Request
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have any active parking requests at the moment
            </p>
            <button
              onClick={() => setCurrentPage('request-parking')}
              className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors font-medium"
            >
              Request Parking
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(currentRequest.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8" data-aos="fade-down">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Allocation Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your parking request status in real-time
          </p>
        </div>

        {/* Status Card */}
        <div
          className="bg-white dark:bg-[#1E293B] rounded-xl shadow-lg p-8"
          data-aos="fade-up"
        >
          {/* Status Indicator */}
          <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 rounded-lg p-6 mb-6`}>
            <div className="flex flex-col items-center">
              <StatusIcon className={`w-20 h-20 ${statusConfig.color} mb-4`} />
              <h2 className={`text-2xl font-bold ${statusConfig.color}`}>
                {statusConfig.label.toUpperCase()}
              </h2>
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Vehicle ID</span>
              <span className="font-semibold text-gray-900 dark:text-white">{currentRequest.vehicleId}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Preferred Zone</span>
              <span className="font-semibold text-gray-900 dark:text-white">Zone {currentRequest.preferredZone}</span>
            </div>
            {currentRequest.status !== 'REQUESTED' && currentRequest.zoneId && (
              <>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Allocated Zone</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Zone {currentRequest.zoneId}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Slot Number</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Slot {currentRequest.slotId}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 dark:text-gray-400">Request Time</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(currentRequest.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Penalty Warning */}
          {currentRequest.penalty && (
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-semibold">Cross-Zone Allocation</p>
                  <p className="mt-1">Your preferred zone was full. You've been allocated to a different zone.</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Button */}
          {(currentRequest.status === 'REQUESTED' || currentRequest.status === 'ALLOCATED') && (
            <button
              onClick={handleCancel}
              className="w-full mt-6 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all font-medium"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel Parking Request
            </button>
          )}
        </div>

        {/* Status Explanation */}
        <div
          className="mt-6 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg p-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status Information
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">REQUESTED:</strong> Your request is in the queue awaiting allocation
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">ALLOCATED:</strong> A parking slot has been assigned to you
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">OCCUPIED:</strong> You are currently using the allocated slot
              </div>
            </div>
            <div className="flex items-start">
              <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">CANCELLED:</strong> The parking request was cancelled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllocationStatus;
