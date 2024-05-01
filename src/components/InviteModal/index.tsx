import React, { useEffect, useState } from 'react';
import { useForm, FieldError, Controller } from 'react-hook-form';
import instance from '@/src/util/axios';
import { useRouter } from 'next/router';
import useInvitees from '@/src/hooks/useInvitees';
import { MembersData } from '@/src/util/zustand';
import Image from 'next/image';
import Button from '../common/button';
import Modal from '../common/modal';
import Input, { InputForm } from '../common/input';
import InitialImage from '../common/navigation/ProfileImage';

interface InviteModalProps {
  openModal: boolean;
  handleModalClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ openModal, handleModalClose }) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    control,
    setValue,
  } = useForm<InputForm>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const router = useRouter();
  const { id } = router.query;
  const idNumber = Number(id);
  const textValue = watch('email');
  const [memberOptions, setMemberOptions] = useState<MembersData[]>([]);
  const [filteredOptions, setFilteredOptions] = useState(memberOptions);

  const { handleLoadInvitees } = useInvitees(idNumber);

  useEffect(() => {
    setFilteredOptions(memberOptions.filter((option) => option.nickname.includes(textValue ?? '')));
  }, [textValue]);

  useEffect(() => {
    const fetchMemberOptions = async () => {
      try {
        const res = await instance.get(`/members?page=1&size=99&dashboardId=6074`);
        const members = res.data.members.slice(1);
        setMemberOptions(members);
        setFilteredOptions(members);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMemberOptions();
  }, []);

  const handleInvite = async () => {
    const email = getValues('email') || '';
    const resetOffset = 1;
    try {
      const data = { email: email };
      await instance.post(`/dashboards/${id}/invitations`, data);
      handleLoadInvitees(resetOffset);
      handleModalClose();
      alert('초대 메일이 발송되었습니다.');
    } catch (error: any) {
      if (error.response && error.response.status !== 201) {
        setError('email', {
          type: 'server',
          message: `${error.response.data.message}`,
        });
      }
    }
  };

  const handleClickOption = (value: string) => {
    setValue('email', value);
    clearErrors('email');
  };

  if (!openModal) {
    return null;
  }

  return (
    <Modal className="w-540 mobile:w-327" openModal={openModal} handleModalClose={handleModalClose}>
      <div className="mb-32 text-24 font-bold mobile:mb-24 mobile:text-20">초대하기</div>
      <form className="flex flex-col" onSubmit={handleSubmit(handleInvite)}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              inputName="email"
              inputContent="example@example.com"
              labelId="email"
              labelText="이메일"
              type="email"
              {...field}
              register={register('email', {
                required: {
                  value: true,
                  message: '이메일을 입력해주세요.',
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '이메일 형식으로 작성해 주세요.',
                },
              })}
              clearError={clearErrors}
              error={errors.email as FieldError}
              inputCheckStyle="flex my-10"
              labelDropStyle="w-full"
            />
          )}
        />
        <div className="overflow-y-auto max-h-132">
          {filteredOptions.map((member) => (
            <div
              key={member.id}
              className="cursor-pointer hover:bg-violet-8% flex gap-10 my-3 rounded-l-99 rounded-r-4"
              onClick={() => handleClickOption(member.email)}
            >
              <div className="rounded-99 w-30 h-30 overflow-hidden">
                {member.profileImageUrl ? (
                  <Image src={member.profileImageUrl} width={30} height={30} alt="profile image" />
                ) : (
                  <InitialImage nickname={member.nickname} />
                )}
              </div>
              {member.nickname}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-16">
          <Button buttonType="modal2" bgColor="white" textColor="gray" onClick={handleModalClose}>
            취소
          </Button>
          <Button
            buttonType="modal2"
            bgColor="violet"
            textColor="white"
            type="submit"
            onClick={handleSubmit(handleInvite)}
            disabled={!textValue || !!errors.email}
          >
            초대
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteModal;
