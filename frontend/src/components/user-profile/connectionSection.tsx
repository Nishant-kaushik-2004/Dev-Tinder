import { Check, X, UserPlus, Edit, Clock, Users } from 'lucide-react';

const ConnectionSection = ({ connectionStatus, onAction, userId, onEditProfile }) => {
  const renderConnectionContent = () => {
    switch (connectionStatus) {
      case 'own_profile':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-info">
              <Edit size={16} />
              <span className="font-medium">This is your profile</span>
            </div>
            <button 
              className="btn btn-primary w-full gap-2"
              onClick={onEditProfile}
            >
              <Edit size={16} />
              Edit Profile
            </button>
          </div>
        );

      case 'connected':
        return (
          <div className="space-y-4">
            <div className="alert alert-success">
              <Users size={16} />
              <span className="font-medium">You are connected</span>
            </div>
            <div className="text-sm text-base-content/70 text-center">
              You can now message each other and see detailed profiles
            </div>
          </div>
        );

      case 'pending_sent':
        return (
          <div className="space-y-4">
            <div className="alert alert-warning">
              <Clock size={16} />
              <span className="font-medium">Request Pending</span>
            </div>
            <button 
              className="btn btn-outline btn-error w-full gap-2 btn-sm"
              onClick={() => onAction('cancel', userId)}
            >
              <X size={16} />
              Cancel Request
            </button>
            <div className="text-xs text-base-content/60 text-center">
              Waiting for them to accept your connection request
            </div>
          </div>
        );

      case 'pending_received':
        return (
          <div className="space-y-4">
            <div className="alert alert-info">
              <UserPlus size={16} />
              <span className="font-medium">Wants to connect</span>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-success flex-1 gap-2"
                onClick={() => onAction('accept', userId)}
              >
                <Check size={16} />
                Accept
              </button>
              <button 
                className="btn btn-outline btn-error flex-1 gap-2"
                onClick={() => onAction('reject', userId)}
              >
                <X size={16} />
                Reject
              </button>
            </div>
            <div className="text-xs text-base-content/60 text-center">
              They want to connect with you
            </div>
          </div>
        );

      case 'not_connected':
      default:
        return (
          <div className="space-y-4">
            <button 
              className="btn btn-primary w-full gap-2"
              onClick={() => onAction('send', userId)}
            >
              <UserPlus size={16} />
              Send Connection Request
            </button>
            <div className="text-xs text-base-content/60 text-center">
              Connect to unlock messaging and detailed profile access
            </div>
          </div>
        );
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Connection Status</h3>
        {renderConnectionContent()}
      </div>
    </div>
  );
};

export default ConnectionSection;