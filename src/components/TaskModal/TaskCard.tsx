import Image from 'next/image';
import { format } from 'date-fns';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import instance from '@/src/util/axios';
import useModal from '@/src/hooks/useModal';
import more from '@/public/assets/icon/moreVert.svg';
import exit from '@/public/assets/icon/close.svg';
import { useColumnList, Column } from '@/src/util/zustand';
import Modal from '../common/modal';
import Chip from '../common/chip';
import ModalPortal from '../common/modalPortal';
import EditTask from './EditTask';
import Comments from './Comments';
import DeleteTask from './DeleteTask';
import ProfileImage from '../common/navigation/ProfileImage';

interface ModalProps {
  openModal: boolean;
  handleModalClose: () => void;
}

interface TaskModalProps extends ModalProps {
  cardId: number;
}

export interface TaskData {
  assignee?: {
    userId: number;
    nickname: string;
    profileImageUrl?: string;
  };
  columnId: number;
  createdAt: string;
  dashboardId: number;
  description: string;
  dueDate?: string;
  id: number;
  imageUrl?: string;
  tags?: string[];
  teamId: string;
  title: string;
  updatedAt: string;
}

export const TaskCard = ({ openModal, handleModalClose, cardId }: TaskModalProps) => {
  if (!openModal) {
    return null;
  }

  const {
    openModal: editTaskModal,
    handleModalClose: editTaskModalClose,
    handleModalOpen: editTaskModalOpen,
  } = useModal();
  const {
    openModal: deleteTaskModal,
    handleModalClose: deleteTaskModalClose,
    handleModalOpen: deleteTaskModalOpen,
  } = useModal();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cardData, setCardData] = useState<TaskData>();
  const [isPending, setIsPending] = useState(true);
  const [currentColumn, setCurrentColumn] = useState<Column>();
  const columnList = useColumnList((state) => state.columnList);

  useEffect(() => {
    const getTaskData = async () => {
      try {
        const response = await instance.get(`cards/${cardId}`);
        setCardData(response.data);
        setCurrentColumn(columnList.find((item) => item.id === response.data.columnId));
      } catch {
        console.log('error');
      } finally {
        setIsPending(false);
      }
    };
    getTaskData();
  }, [editTaskModal]);

  const dueDate = cardData?.dueDate ? format(new Date(cardData.dueDate).toLocaleString('en-US'), 'yyyy.MM.dd') : '';
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownOpen: MouseEventHandler<HTMLButtonElement> = () => setIsDropdownOpen(true);
  const handleEditClick: MouseEventHandler<HTMLButtonElement> = () => {
    editTaskModalOpen();
    setIsDropdownOpen(false);
  };
  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    deleteTaskModalOpen();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  if (!isPending && cardData)
    return (
      <Modal
        className="flex-shrink-0 max-h-910 h-vh overflow-y-auto mobile:w-400"
        openModal={openModal}
        handleModalClose={handleModalClose}
      >
        <div className="flex flex-row mobile:flex-col-reverse justify-between">
          <div className="text-24 font-semibold">{cardData?.title}</div>
          <div className="flex justify-end gap-24">
            {isDropdownOpen && (
              <div
                className="flex flex-col absolute border-1 rounded-6 p-6 text-14 font-normal bg-white top-65 right-95"
                ref={dropdownRef}
              >
                <button className="px-16 py-4 rounded-6 hover:text-violet hover:bg-violet-8%" onClick={handleEditClick}>
                  수정
                </button>
                <button
                  className="px-16 py-4 rounded-6 hover:text-violet hover:bg-violet-8%"
                  onClick={handleDeleteClick}
                >
                  삭제
                </button>
              </div>
            )}
            <button onClick={handleDropdownOpen}>
              <Image src={more} alt="more" />
            </button>
            <button onClick={handleModalClose}>
              <Image src={exit} alt="exit" />
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-24 mobile:gap-16 mobile:flex-col-reverse">
          <div className="flex flex-col gap-16 max-w-450 w-full mt-12">
            <div className="flex flex-row flex-wrap gap-12">
              <div className="h-26">
                <Chip dot>{currentColumn?.title}</Chip>
              </div>
              {!!cardData?.tags?.length && (
                <div className="flex flex-row flex-wrap gap-6 border-l-1 overflow-auto border-gray-d9 pl-12">
                  {cardData.tags.map((tag) => {
                    return <Chip key={tag}>{tag}</Chip>;
                  })}
                </div>
              )}
            </div>
            <p className="text-14 font-normal">{cardData?.description}</p>
            <div className="w-450 h-full">
              {!!cardData.imageUrl && (
                <Image src={cardData.imageUrl} width={700} height={700} alt="Task Image" className="rounded-6" />
              )}
            </div>
            {!!cardData.id && (
              <Comments cardId={cardId} columnId={cardData.columnId} dashboardId={cardData.dashboardId} />
            )}
          </div>
          {(!!cardData?.assignee || !!cardData?.dueDate) && (
            <div className="flex flex-col mobile:flex-row gap-10 border-1 border-gray-d9 rounded-8 max-w-200 mobile:max-w-none w-full h-fit p-16 min-w-180 my-16">
              {!!cardData?.assignee && (
                <div className="flex flex-col gap-6 mobile:w-1/2">
                  <span className="text-12 font-semibold">담당자</span>
                  <div className="flex flex-row justify-start content-center gap-8">
                    <div className="w-34 h-34 overflow-hidden rounded-99">
                      <ProfileImage src={cardData?.assignee?.profileImageUrl} nickname={cardData?.assignee?.nickname} />
                    </div>
                    <span className="text-14 font-normal content-center">{cardData?.assignee?.nickname}</span>
                  </div>
                </div>
              )}
              {!!cardData?.dueDate && (
                <div className="flex flex-col gap-6 mobile:w-1/2">
                  <span className="text-12 font-semibold">마감일</span>
                  <span className="text-14 font-normal">{dueDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <ModalPortal>
          <EditTask cardData={cardData} openModal={editTaskModal} handleModalClose={editTaskModalClose} />
        </ModalPortal>
        <ModalPortal>
          <DeleteTask
            openModal={deleteTaskModal}
            handleModalClose={deleteTaskModalClose}
            handleCardClose={handleModalClose}
            cardTitle={cardData.title}
            cardId={cardData.id}
          />
        </ModalPortal>
      </Modal>
    );
  return null;
};
