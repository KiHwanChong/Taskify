import Image from 'next/image';
import add from '@/public/assets/icon/addWhite.svg';
import instance from '@/src/util/axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { handleCancelInvitation, handleDeleteMember } from '@/src/pages/api/dashboardEditApi';
import { useDashboardListStore, useMembersStore, useInviteesStore } from '@/src/util/zustand';
import useModal from '@/src/hooks/useModal';
import useInvitees from '@/src/hooks/useInvitees';
import useMembers from '@/src/hooks/useMembers';
import useDashboardList from '@/src/hooks/useDashboardList';
import dynamic from 'next/dynamic';
import Button from '../common/button';
import Table from './table';
import TableHeader from './table/TableHeader';
import TableList from './table/TableList';
import DashboardCard from './DashboardCard';
import Input, { InputForm } from '../common/input';
import MembersPagination from './table/MembersPagination';
import InviteePagination from './table/InviteePagination';
import InviteModal from '../InviteModal';
import ModalPortal from '../common/modalPortal';

const ColorPicker = dynamic(() => import('../common/colorpicker'), { ssr: false });

const Dashboard = () => {
  const selectedDashboard = useDashboardListStore((state) => state.selectedDashboard);
  const setSelectedDashboard = useDashboardListStore((state) => state.setSelectedDashboard);
  const members = useMembersStore((state) => state.membersData);
  const invitees = useInviteesStore((state) => state.inviteesData);
  const { register, getValues, handleSubmit } = useForm<InputForm>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const [selectedColor, setSelectedColor] = useState<string>(selectedDashboard?.color);
  const router = useRouter();
  const { id } = router.query;
  const idNumber = Number(id);
  const { openModal: inviteModal, handleModalClose: inviteModalClose, handleModalOpen: inviteModalOpen } = useModal();
  const { handleLoadInvitees } = useInvitees(idNumber);
  const { handleLoadMembers } = useMembers(idNumber);
  const { handleLoadDashboardList } = useDashboardList();

  const handleEditDashboard = async () => {
    const dashboardTitle = getValues('text') || '';
    try {
      const data = { title: dashboardTitle, color: selectedColor };
      await instance.put(`/dashboards/${idNumber}`, data).then((res) => setSelectedDashboard(res.data));
      handleLoadDashboardList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDashboard = async () => {
    const confirmDeletion = window.confirm('대시보드를 삭제할까요?');
    if (!confirmDeletion) return;

    await instance.delete(`/dashboards/${idNumber}`);
    alert('대시보드를 삭제했습니다.');
    router.push('/my-dashboard');
    handleLoadDashboardList();
  };

  return (
    <div className="flex flex-col gap-25 tablet:gap-12">
      <DashboardCard>
        <div className="flex justify-between">
          <p className="font-bold text-20">{selectedDashboard?.title}</p>
          <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        </div>
        <form onSubmit={handleSubmit(handleEditDashboard)}>
          <Input
            inputName="text"
            inputContent={selectedDashboard?.title}
            labelId="text"
            labelText="대시보드 이름"
            type="text"
            register={register('text', {})}
            inputCheckStyle="flex my-10"
            labelDropStyle="w-full"
          />
          <div className="flex justify-end">
            <Button
              buttonType="modal1"
              type="submit"
              bgColor="violet"
              textColor="white"
              onClick={handleSubmit(handleEditDashboard)}
            >
              변경
            </Button>
          </div>
        </form>
      </DashboardCard>

      <DashboardCard className="px-0 pb-0">
        <TableHeader title="구성원">
          <MembersPagination />
        </TableHeader>
        <Table label="이름">
          {Array.isArray(members) &&
            members.map((member) => (
              <div className="relative" key={member.id}>
                <div className="absolute top-15 left-40 bg-white px-7 py-3 rounded-10 text-black opacity-0 hover:opacity-100 transition-opacity duration-200">
                  {member.email}
                </div>
                <TableList
                  src={member.profileImageUrl}
                  text={member.nickname}
                  isOwner={member.isOwner}
                  button={
                    <Button
                      buttonType="delete"
                      textColor="violet"
                      bgColor="white"
                      onClick={() => handleDeleteMember(member.id).then(() => handleLoadMembers())}
                    >
                      삭제
                    </Button>
                  }
                />
              </div>
            ))}
        </Table>
      </DashboardCard>

      <DashboardCard className="px-0 pb-0 relative">
        <TableHeader title="초대 내역">
          <InviteePagination />
          <Button
            buttonType="modal1"
            bgColor="violet"
            textColor="white"
            className="mobile:absolute mobile:right-20 mobile:top-90 w-105"
            onClick={inviteModalOpen}
          >
            <div className="flex gap-6 items-center justify-center ">
              <Image src={add} alt="add" />
              초대하기
            </div>
          </Button>
        </TableHeader>
        <Table label="이름">
          {invitees?.length === 0 && <p className="text-center mb-50 text-gray-400">초대된 사용자가 없습니다.</p>}
          {Array.isArray(invitees) &&
            invitees.map((invitee) => (
              <div className="relative" key={invitee.id}>
                <div className="absolute top-15 left-40 bg-white px-7 py-3 rounded-10 text-black opacity-0 hover:opacity-100 transition-opacity duration-200">
                  {invitee.invitee.email}
                </div>

                <TableList
                  text={invitee.invitee.nickname}
                  button={
                    <Button
                      buttonType="delete"
                      textColor="violet"
                      bgColor="white"
                      onClick={() => {
                        handleCancelInvitation(idNumber, invitee.id).then(() => handleLoadInvitees());
                      }}
                    >
                      취소
                    </Button>
                  }
                />
              </div>
            ))}
        </Table>
      </DashboardCard>
      <Button buttonType="dashboardDelete" bgColor="white" className="mt-25" onClick={() => handleDeleteDashboard()}>
        대시보드 삭제하기
      </Button>
      <ModalPortal>
        <InviteModal openModal={inviteModal} handleModalClose={inviteModalClose} />
      </ModalPortal>
    </div>
  );
};

export default Dashboard;
