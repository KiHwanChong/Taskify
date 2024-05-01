import search from '@/public/assets/icon/search.svg';
import Image from 'next/image';
import { useInvitationList } from '@/src/util/zustand';

const InvitationSearch = () => {
  const invitationList = useInvitationList((state) => state.invitationList);
  const setSearchedInvitationList = useInvitationList((state) => state.setSearchedInvitationList);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const searched = invitationList.filter(
      (invitation) => invitation.dashboard.title.includes(value) || invitation.inviter.nickname.includes(value),
    );
    setSearchedInvitationList(searched);
  };

  return (
    <div className="mx-28 my-20">
      <form action="" className="flex px-16 py-8 gap-8 h-40 rounded-6 outline outline-1 outline-gray-d9">
        <Image src={search} alt="search" />
        <input type="text" placeholder="검색하기" onChange={(e) => handleSearch(e)} />
      </form>
    </div>
  );
};

export default InvitationSearch;
