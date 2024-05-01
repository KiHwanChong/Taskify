import React, { useState, useEffect, useCallback, useRef } from 'react';
import fetchInvitations from '@/src/pages/api/getInvitationApi';
import putInvitation from '@/src/pages/api/putInvitationApi';
import InvitationList from '@/src/components/mydashboard/table/InvitaionList';
import Button from '@/src/components/common/button';
import instance from '@/src/util/axios';
import { useMyDashboardListStore, useInvitationList } from '@/src/util/zustand';
import useDashboardList from '@/src/hooks/useDashboardList';

const InvitationTable = () => {
  const invitations = useInvitationList((state) => state.invitationList);
  const setInvitations = useInvitationList((state) => state.setInvitationList);
  const removeInvitation = useInvitationList((state) => state.removeInvitation);
  const searchedInvitations = useInvitationList((state) => state.searchedInvitationList);
  const [loading, setLoading] = useState(false);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const setMyDashboardList = useMyDashboardListStore((state) => state.setMyDashboardList);
  const { handleLoadDashboardList } = useDashboardList();
  const handleInvitationResponse = async (invitationId: number, accept: boolean) => {
    try {
      setLoading(true);
      await putInvitation(invitationId, accept);
      removeInvitation(invitationId);
      const res = await instance.get('/dashboards?navigationMethod=pagination&page=1&size=5');
      console.log(res.data);
      setMyDashboardList(res.data.dashboards);
      handleLoadDashboardList(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadInvitations = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetchInvitations(4, cursorId);

      const newInvitations =
        response?.invitations.filter((invitation) => !invitations.some((inv) => inv.id === invitation.id)) ?? [];
      const updatedInvitations = [...invitations, ...newInvitations];
      setInvitations(updatedInvitations);
      setCursorId(response?.cursorId ?? null);
      setHasMore(response?.invitations.length === 4 ?? false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [loading, hasMore, cursorId, setInvitations, invitations]);

  useEffect(() => {
    const handleIntersect = async (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && hasMore) {
          setLoading(true);
          loadInvitations().then(() => {
            setLoading(false);
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore, loadInvitations]);

  return (
    <div>
      <div className="grid grid-cols-3 mt-24 pl-70 text-gray-9f mobile:hidden">
        <p>이름</p>
        <p>초대자</p>
        <p>수락 여부</p>
      </div>
      <div className="flex flex-col overflow-y-scroll h-340 tablet:h-190 mobile:h-300">
        {(searchedInvitations.length > 0 ? searchedInvitations : invitations).map((invitation, index) => (
          <div key={invitation.id} ref={index === invitations.length - 1 ? observerRef : undefined}>
            <InvitationList
              nickname={invitation.dashboard.title}
              inviter={invitation.inviter.nickname}
              acceptButton={
                <Button
                  buttonType="decision"
                  bgColor="violet"
                  textColor="white"
                  onClick={() => handleInvitationResponse(invitation.id, true)}
                >
                  수락
                </Button>
              }
              rejectButton={
                <Button
                  buttonType="decision"
                  textColor="violet"
                  className="outline outline-1 outline-gray-d9"
                  onClick={() => handleInvitationResponse(invitation.id, false)}
                >
                  거절
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvitationTable;
