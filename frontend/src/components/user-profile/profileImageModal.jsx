import { X } from 'lucide-react';

const ProfileImageModal = ({ isOpen, onClose, imageSrc, userName }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box max-w-2xl p-0 bg-transparent shadow-none">
        {/* Close Button */}
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-base-100/80 backdrop-blur-sm hover:bg-base-100"
          onClick={onClose}
        >
          <X size={16} />
        </button>
        
        {/* Image Container */}
        <div className="relative">
          <img 
            src={imageSrc} 
            alt={userName}
            className="w-full h-auto rounded-lg shadow-2xl max-h-[80vh] object-contain"
            onError={(e) => {
              e.target.src = "https://geographyandyou.com/images/user-profile.png";
            }}
          />
          
          {/* Image Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
            <p className="text-white font-medium text-center">{userName}</p>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrop */}
      <div className="modal-backdrop bg-black/50 backdrop-blur-sm"></div>
    </div>
  );
};

export default ProfileImageModal;