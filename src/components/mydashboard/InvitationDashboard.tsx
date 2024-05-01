import React, { useEffect } from 'react';
import fetchInvitations from '@/src/pages/api/getInvitationApi';
import MyDashboardList from '@/src/components/mydashboard/MyDashboardList';
import InvitationTable from '@/src/components/mydashboard/table/';
import { useInvitationList } from '@/src/util/zustand';
import InvitationSearch from './table/InvitationSearch';
import NoInvitation from './NoInvitation';

const InvitationDashboard = () => {
  const invitationList = useInvitationList((state) => state.invitationList);
  const setInvitations = useInvitationList((state) => state.setInvitationList);
  useEffect(() => {
    const fetchAndSetInvitations = async () => {
      try {
        const response = await fetchInvitations(5);
        if (response) {
          setInvitations(response.invitations);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetInvitations();
  }, []);

  return (
    <div className="flex flex-col bg-gray-fa min-h-[calc(100vh-7.8rem)]">
      <div className=" gap-12 mt-40 ml-40 mr-40 mobile:mx-24">
        <MyDashboardList />
      </div>

      <div className="max-w-1022 h-auto mx-40 my-40 py-32 rounded-lg bg-white mobile:mx-24 ">
        <h1 className="self-start pl-28 text-24 font-bold mobile:text-20">초대받은 대시보드</h1>
        {invitationList.length > 0 ? (
          <>
            <InvitationSearch />
            <InvitationTable />
          </>
        ) : (
          <NoInvitation />
        )}
      </div>
    </div>
  );
};

export default InvitationDashboard;
