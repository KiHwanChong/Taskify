import ProfileImage from './ProfileImage';

export type MyProfileProps = {
  nickname: string;
  src?: string;
};

const MyProfile = ({ nickname, src }: MyProfileProps) => {
  return (
    <div className="flex gap-12 items-center">
      <ProfileImage nickname={nickname} src={src} />
      {nickname && <p className="mobile:hidden">{nickname}</p>}
    </div>
  );
};

export default MyProfile;
