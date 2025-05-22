import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import toast from "react-hot-toast";
import { CameraIcon, EditIcon, UploadIcon } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Button from "@/components/common/Button";
import CustomToast from "@/components/common/CustomToast";

function EditableUserAvatar() {
  const { user } = useAuth();
  const [editAvatar, setEditAvatar] = useState(false);

  const closeModal = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditAvatar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", closeModal);

    return () => {
      window.removeEventListener("keydown", closeModal);
    };
  }, []);
  return (
    <>
      <div className="relative size-24 rounded-full self-center ring-2 ring-surface/10">
        <UserImage avatar={user?.avatar} username={user?.name || "?"} />
        <div className="group absolute -bottom-1 right-2 ">
          <EditIcon
            className="absolute right-0 bottom-0 cursor-pointer text-accent/60 hover:text-accent/90 transition-colors stroke-2"
            onClick={() => setEditAvatar(true)}
          />
          {/* popup */}
          <div className="absolute w-[130px] z-50 -top-14 -right-6 bg-bg/90 text-fg text-sm pointer-events-none rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
            edit profile image
          </div>
        </div>
      </div>
      {editAvatar && (
        <UploadAvatarModal closeModal={() => setEditAvatar(false)} />
      )}
    </>
  );
}

type UserImageProps = {
  avatar?: string;
  username: string;
};
const UserImage = ({ avatar, username }: UserImageProps) => {
  return avatar ? (
    <Image
      src={avatar}
      alt="Profile Image"
      width={160}
      height={160}
      className="w-full h-full rounded-full"
    />
  ) : (
    <div className="w-full h-full rounded-full flex items-center justify-center font-heading font-bold text-6xl  bg-bg/75 text-fg/80">
      {username.charAt(0).toUpperCase()}
    </div>
  );
};

const UploadAvatarModal = ({ closeModal }: { closeModal: () => void }) => {
  const { user, setUser } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsLoading(false);
        setError(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleButtonClick = async () => {
    if (!user) return;
    if (image) {
      await uploadImage();
    } else {
      setIsLoading(true);
      inputRef.current?.click();
    }
  };

  const uploadImage = async () => {
    if (!user || !image) return;
    setIsLoading(true);
    if (image.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      setIsLoading(false);
      return;
    }

    const { error, url } = await user.uploadAvatar(image);
    setIsLoading(false);
    if (error || !url) {
      setError(error || "Failed to upload image");
      return;
    }

    setUser(user);
    toast.custom((t) => (
      <CustomToast t={t} type="success" message="Image updated successfully" />
    ));
    setPreview(url);
    closeModal();
  };

  useEffect(() => {
    if (error) {
      toast.custom((t) => <CustomToast t={t} type="error" message={error} />);
    }
  }, [error]);

  return (
    <div
      className="fixed inset-0 h-screen z-50 px-3 flex items-center justify-center bg-bg/40 cursor-auto"
      onClick={closeModal}
    >
      <div
        className="profile-dropdown w-full max-w-[460px] p-4 pb-8 flex flex-col items-center gap-8 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3 w-full">
          <Heading className="text-fg w-full">Profile Picture</Heading>
          <Paragraph size="sm" className="w-full max-w-[42ch] text-surface/60">
            Profile picture make your account more personalized, and help others
            recognize you better
          </Paragraph>
        </div>
        {/* user image */}
        <div className="w-64 h-64 flex items-center justify-center self-center ring-2 ring-surface/10 rounded-full">
          <UserImage avatar={preview as string} username={user?.name || "?"} />
        </div>
        {/* upload image */}
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
          className="hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <Button
          size="sm"
          variant="ghost-2"
          className="w-[320px] flex justify-center gap-4 ring ring-surface/10 group hover:ring-accent/50 hover:bg-accent/70 transition-all duration-200 ease-in-out"
          onClick={handleButtonClick}
          isSimple
          isLoading={isLoading}
          disabled={isLoading}
        >
          {!image ? (
            <>
              <span className="text-lg text-surface group-hover:text-bg transition-all duration-200 ease-in-out">
                Change profile picture
              </span>
              <CameraIcon className="size-5 text-surface/90 group-hover:text-bg transition-all duration-200 ease-in-out" />
            </>
          ) : (
            <>
              <span className="text-lg text-surface group-hover:text-bg transition-all duration-200 ease-in-out">
                Add profile picture
              </span>
              <UploadIcon className="size-5 text-surface/90 group-hover:text-bg transition-all duration-200 ease-in-out" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditableUserAvatar;
