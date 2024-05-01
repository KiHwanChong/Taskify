import { deleteColumns } from '@/src/pages/api/columnsApi';
import Button from '../../common/button';
import Modal from '../../common/modal';

type Columns = {
  id: number;
  title: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
};

interface DeleteColumnModalProps {
  openModal: boolean;
  handleModalClose: () => void;
  columnId: number;
  setColumnsList: React.Dispatch<React.SetStateAction<Columns[]>>;
}

const DeleteColumnModal: React.FC<DeleteColumnModalProps> = ({
  openModal,
  handleModalClose,
  columnId,
  setColumnsList,
}) => {
  const deleteColumn = async () => {
    try {
      await deleteColumns(columnId);
      setColumnsList((prevColumns) => prevColumns.filter((column) => column.id !== columnId));
      handleModalClose();
    } catch (error) {
      console.error('Error deleting column', error);
    }
  };

  if (!openModal) {
    return null;
  }

  return (
    <Modal
      className=" justify-between w-540 h-250 mobile:w-327"
      openModal={openModal}
      handleModalClose={handleModalClose}
    >
      <span className="flex justify-center mt-50">컬럼의 모든 카드가 삭제됩니다.</span>
      <div className="flex flex-row-reverse gap-12">
        <Button buttonType="modal2" bgColor="violet" textColor="white" onClick={deleteColumn}>
          삭제
        </Button>
        <Button buttonType="modal2" bgColor="white" textColor="gray" onClick={handleModalClose}>
          취소
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteColumnModal;
