import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

type ProfileImageProps = {
  nickname?: string;
  className?: string;
  src?: string;
};

const ProfileImage = ({ nickname, className, src }: ProfileImageProps) => {
  if (src) {
    return (
      <div className="w-30 h-30 relative">
        <Image
          src={src}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt="profile"
          className={twMerge('border-2 rounded-99', className)}
        />
      </div>
    );
  }
  if (nickname) {
    const initial = String(nickname[0]).toUpperCase();

    return (
      <div
        className={twMerge(
          'w-30 h-30 border-2 rounded-99 bg-blue-bg flex items-center justify-center text-blue',
          className,
        )}
      >
        {initial}
      </div>
    );
  }
};

export default ProfileImage;
