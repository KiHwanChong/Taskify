import Image from 'next/image';
import unsubscribeEmail from '@/public/assets/icon/unsubscribeEmail.svg';

const NoInvitation = () => {
  return (
    <div className="flex flex-col items-center mt-66 mb-66">
      <Image src={unsubscribeEmail} alt="unsubscribeEmail " className="mb-24" />
      <p className="text-18 font-normal text-gray-9f mobile:text-14">아직 초대받은 대시보드가 없어요</p>
    </div>
  );
};
export default NoInvitation;
