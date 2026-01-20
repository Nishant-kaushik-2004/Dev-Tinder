import { X } from "lucide-react";

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  userName: string;
}

const ProfileImageModal = ({
  isOpen,
  onClose,
  imageSrc,
  userName,
}: ProfileImageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div
        className="modal-box bg-transparent shadow-none p-0 flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Wrapper (shrinks to image width) */}
        <div className="relative inline-block max-w-full">
          {/* Close Button */}
          <button
            className="btn btn-sm btn-circle absolute right-3 top-3 z-20 bg-base-100/80 backdrop-blur"
            onClick={onClose}
          >
            <X size={16} />
          </button>

          {/* Image */}
          <img
            src={imageSrc}
            alt={userName}
            className="
              max-h-[80vh]
              max-w-[90vw]
              object-contain
              rounded-xl
              shadow-2xl
            "
            onError={(e) => {
              e.currentTarget.src =
                "https://geographyandyou.com/images/user-profile.png";
            }}
          />

          {/* Caption – EXACT image width */}
          <div className="absolute bottom-0 left-0 w-full rounded-b-xl bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-center text-white font-medium">{userName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
