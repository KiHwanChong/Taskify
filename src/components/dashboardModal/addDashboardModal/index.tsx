import React, { useState } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import instance from '@/src/util/axios';
import { useRouter } from 'next/router';
import useDashboardList from '@/src/hooks/useDashboardList';
import Button from '../../common/button';
import Modal from '../../common/modal';
import ModalPortal from '../../common/modalPortal';
import ColorPicker from '../../common/colorpicker';
import Input, { InputForm } from '../../common/input';

interface AddDashboardModalProps {
  openModal: boolean;
  handleModalClose: () => void;
}

const AddDashboardModal: React.FC<AddDashboardModalProps> = ({ openModal, handleModalClose }) => {
  const [selectedColor, setSelectedColor] = useState<string>('#7AC555');
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<InputForm>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const router = useRouter();
  const textValue = watch('text');
  const { setSelectedDashboard, handleLoadDashboardList } = useDashboardList();
  const resetOffset = 1;
  const handleCreateDashboard = async () => {
    const dashboardTitle = getValues('text') || '';
    try {
      const data = { title: dashboardTitle, color: selectedColor };
      const res = await instance.post(`/dashboards/`, data);
      router.push(`/dashboard/${res.data.id}`);
      setSelectedDashboard(res.data);
      handleLoadDashboardList(resetOffset);
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!openModal) {
    return null;
  }

  return (
    <ModalPortal>
      <Modal className="w-540 mobile:w-327" openModal={openModal} handleModalClose={handleModalClose}>
        <div className="mb-32 text-24 font-bold mobile:mb-24 mobile:text-20">새로운 대시보드</div>
        <form className="flex flex-col" onSubmit={handleSubmit(handleCreateDashboard)}>
          <Input
            inputName="text"
            inputContent="뉴프로젝트"
            labelId="text"
            labelText="대시보드 이름"
            type="text"
            register={register('text', {
              required: {
                value: true,
                message: '대시보드 이름을 입력해주세요',
              },
            })}
            clearError={clearErrors}
            error={errors.text as FieldError}
            inputCheckStyle="flex my-10"
            labelDropStyle="w-full"
          />
          <div className="mb-28">
            <ColorPicker modal selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
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
              disabled={!textValue}
              onClick={handleSubmit(handleCreateDashboard)}
            >
              생성
            </Button>
          </div>
        </form>
      </Modal>
    </ModalPortal>
  );
};

export default AddDashboardModal;
