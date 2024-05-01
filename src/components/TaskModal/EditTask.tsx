import Image from 'next/image';
import instance from '@/src/util/axios';
import { twMerge } from 'tailwind-merge';
import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import add from '@/public/assets/icon/addViolet.svg';
import close from '@/public/assets/icon/close.svg';
import { useColumnList, useIsCardFormatted, useTotalMembersStore } from '@/src/util/zustand';
import { format } from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers';
import { getColumns } from '@/src/pages/api/columnsApi';
import dropdownIcon from '@/public/assets/icon/arrowDropDown.svg';
import TaskLabel from './TaskLabel';
import Button from '../common/button';
import Modal from '../common/modal';
import { CardData, Member } from './CreateTask';

import Chip from '../common/chip';
import ProfileImage from '../common/navigation/ProfileImage';

interface EditTaskModalProps {
  openModal: boolean;
  handleModalClose: () => void;
  cardData: TaskData;
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

interface ColumnData {
  id: number;
  title: string;
}

const EditTask: React.FC<EditTaskModalProps> = ({ openModal, handleModalClose, cardData }) => {
  if (!openModal) return null;

  const [memberData, setMemberData] = useState<Member[]>([]);
  const [tagValue, setTagValue] = useState<string>();
  const [editData, setEditData] = useState<CardData>({
    dashboardId: cardData.dashboardId,
    columnId: cardData.columnId,
    title: cardData.title,
    description: cardData.description,
    tags: cardData.tags || [],
    imageUrl: cardData.imageUrl,
    dueDate: cardData.dueDate,
  });

  const columnList = useColumnList((state) => state.columnList);
  const setColumnList = useColumnList((state) => state.setColumnList);
  const [currentColumn, setCurrentColumn] = useState<ColumnData | undefined>({ id: editData.columnId, title: '' });
  const [isColumnSelectOpen, setIsColumnSelectOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [currentAssigneee, setCurrentAssigneee] = useState<Member>();
  const totalMembers = useTotalMembersStore((state) => state.totalMembersData);
  const setIsCardFormatted = useIsCardFormatted((state) => state.setIsCardFormatted);
  const columnRef = useRef<HTMLDivElement>(null);
  const assigneeRef = useRef<HTMLDivElement>(null);
  const isRequiredFilled = editData.title && editData.description;
  const currentImage = editData.imageUrl || cardData.imageUrl;
  const imageBg = twMerge('z-10 p-24 w-fit rounded-6', currentImage ? '' : 'bg-gray-d9');

  useEffect(() => {
    setMemberData(totalMembers);
    const result = getColumns(cardData.dashboardId);
    result.then((data) => {
      setColumnList(
        data.data.map((column: any) => {
          return { id: column.id, title: column.title };
        }),
      );
    });
  }, []);

  useEffect(() => {
    setCurrentColumn(columnList.find((item) => item.id === editData.columnId));
  }, [columnList]);

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEditData((prev) => {
      return { ...prev, title: e.target.value };
    });
  };
  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setEditData((prev) => {
      return { ...prev, description: e.target.value };
    });
  };
  const handleColumnlistOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsColumnSelectOpen(!isColumnSelectOpen);
  };
  const handleTagChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const tags = e.target.value.trim();
    setTagValue(tags);
  };
  const handleTagEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const tagInput = e.target as HTMLInputElement;
    const tag = tagInput.value.trim();

    if ((e.key === ' ' || e.key === 'Enter') && tag !== '' && !editData.tags.includes(tag)) {
      editData.tags.push(tag);
      return setTagValue('');
    }
    return null;
  };
  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    const formdata = new FormData();
    if (file) {
      formdata.append('image', file);
      const reader = new FileReader();
      reader.onload = async () => {
        const response = await instance.post(`columns/${editData.columnId}/card-image`, formdata);
        if (response.status === 201) {
          setEditData((prev) => {
            return { ...prev, imageUrl: response.data.imageUrl };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditClick = async () => {
    const response = await instance.put(`cards/${cardData.id}`, editData);
    if (response.status === 200) {
      handleModalClose();
      setIsCardFormatted(true);
    }
  };

  useEffect(() => {
    const handleColumnOutsideClick = (e: MouseEvent) => {
      if (columnRef.current && !columnRef.current.contains(e.target as Node)) {
        setIsColumnSelectOpen(false);
      }
    };
    const handleAssigneeOutsideClick = (e: MouseEvent) => {
      if (assigneeRef.current && !assigneeRef.current.contains(e.target as Node)) {
        setIsAssigneeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleColumnOutsideClick);
    document.addEventListener('mousedown', handleAssigneeOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleColumnOutsideClick);
      document.removeEventListener('mousedown', handleAssigneeOutsideClick);
    };
  }, []);

  return (
    <Modal
      className="max-w-506 w-full max-h-910 h-svh mobile:w-400"
      openModal={openModal}
      handleModalClose={handleModalClose}
    >
      <div className="text-24 font-bold">할 일 수정</div>
      <form className="flex flex-col gap-32 overflow-y-auto">
        <div className="flex flex-row max-w-450 mobile:flex-col gap-16 mobile:gap-24">
          <TaskLabel htmlFor="status" label="상태">
            <div className=" max-w-217 w-full border-1 h-48 border-gray-9f rounded-6 relative focus:border-violet  mobile:max-w-none">
              <div className="px-16 py-10">
                <Chip dot size="large">
                  {currentColumn?.title}
                </Chip>
              </div>

              <button onClick={handleColumnlistOpen}>
                <Image
                  src={dropdownIcon}
                  alt="dropdown"
                  className="absolute right-15 top-1/2 transform -translate-y-1/2"
                />
              </button>
              {isColumnSelectOpen && (
                <div
                  ref={columnRef}
                  className="flex flex-col gap-4 align-top absolute top-45 -left-1 border-1 bg-white border-gray-9f rounded-6 w-full p-15 mt-3 z-10"
                >
                  {columnList.map((column) => {
                    return (
                      <button
                        className="flex text-left rounded-11 hover:bg-gray-ee"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentColumn(columnList.find((item) => item.id === column.id));
                          setIsColumnSelectOpen(false);
                          setEditData((prev) => {
                            return { ...prev, columnId: column.id };
                          });
                        }}
                      >
                        <Chip dot size="large">
                          {column.title}
                        </Chip>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </TaskLabel>
          <TaskLabel htmlFor="assignee" label="담당자">
            <div className="max-w-217 w-full h-48 border-1 border-gray-9f rounded-6 relative focus:border-violet  mobile:max-w-none">
              <button
                className="h-full"
                onClick={(e) => {
                  e.preventDefault();
                  setIsAssigneeOpen(!isAssigneeOpen);
                }}
              >
                {currentAssigneee ? (
                  <div className="flex flex-row items-center gap-8 px-16 py-10">
                    <ProfileImage src={currentAssigneee?.profileImageUrl} nickname={currentAssigneee?.nickname} />
                    <div>{currentAssigneee?.nickname}</div>
                  </div>
                ) : (
                  <div className="px-16 py-10">이름을 입력해 주세요.</div>
                )}
                <Image
                  src={dropdownIcon}
                  alt="dropdown"
                  className="absolute right-15 top-1/2 transform -translate-y-1/2"
                />
              </button>
              {isAssigneeOpen && (
                <div
                  ref={assigneeRef}
                  className="flex flex-col gap-4 align-top absolute top-45 -left-1 border-1 bg-white border-gray-9f rounded-6 w-full p-8 mt-3"
                >
                  <button
                    className="flex flex-row gap-8 rounded-6 hover:bg-gray-ee p-8"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentAssigneee(undefined);
                      setIsAssigneeOpen(false);
                      setEditData((prev) => {
                        return { ...prev, assigneeUserId: undefined };
                      });
                    }}
                  >
                    이름을 입력해 주세요.
                  </button>
                  {memberData.map((member) => {
                    return (
                      <button
                        key={member?.userId}
                        className="flex flex-row items-center gap-8 rounded-6 hover:bg-gray-ee p-8"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentAssigneee(totalMembers.find((item) => item.userId === member?.userId));
                          setIsAssigneeOpen(false);
                          setEditData((prev) => {
                            return { ...prev, assigneeUserId: member?.userId };
                          });
                        }}
                      >
                        <ProfileImage src={member?.profileImageUrl} nickname={member?.nickname} />
                        {member?.nickname}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </TaskLabel>
        </div>
        <TaskLabel htmlFor="title" label="제목" isRequired>
          <input
            id="title"
            className="max-w-450 border-1 border-gray-9f rounded-6 focus:border-violet px-16 py-14"
            placeholder="제목을 입력해 주세요"
            value={editData.title}
            required
            onChange={handleTitleChange}
          />
        </TaskLabel>
        <TaskLabel htmlFor="description" label="설명" isRequired>
          <textarea
            id="description"
            className="max-w-450 resize-none border-1 border-gray-9f rounded-6 focus-within:border-violet outline-none px-16 py-14"
            placeholder="설명을 입력해 주세요"
            required
            value={editData.description}
            onChange={handleDescriptionChange}
          />
        </TaskLabel>
        <TaskLabel htmlFor="due-date" label="마감일">
          <DateTimePicker
            label="날짜를 입력해 주세요"
            className="max-w-450"
            value={editData.dueDate ? new Date(editData.dueDate) : undefined}
            onChange={(date) => {
              setEditData((prev) => {
                return { ...prev, dueDate: date ? format(date, 'yyyy-MM-dd HH:mm') : undefined };
              });
            }}
          />
        </TaskLabel>
        <TaskLabel htmlFor="tag" label="태그">
          {!!editData.tags.length && (
            <div className="flex flex-row gap-6 w-full flex-wrap">
              {editData.tags.map((tag) => {
                return (
                  <Chip>
                    {tag}
                    <button
                      onClick={() => {
                        editData.tags.pop();
                        setEditData((prev) => {
                          return { ...prev };
                        });
                      }}
                    >
                      <Image src={close} width={14} height={14} alt="close" />
                    </button>
                  </Chip>
                );
              })}
            </div>
          )}
          <input
            id="tag"
            type="text"
            placeholder="입력 후 Enter"
            value={tagValue}
            className="max-w-450 border-1 border-gray-9f rounded-6 focus-within:border-violet px-16 py-14"
            onChange={handleTagChange}
            onKeyUp={handleTagEnter}
          />
        </TaskLabel>
        <TaskLabel label="이미지" divClass="relative">
          <label htmlFor="image" className={imageBg}>
            <Image src={add} width={28} height={28} alt="add image" />
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="w-full h-50 py-15 px-16 border-1 rounded-lg border-gray-9f text-black-33 focus:outline-none  focus:border-violet"
            hidden
            name="이미지 등록"
            onChange={handleImageChange}
          />
          {!!currentImage && (
            <Image
              src={currentImage}
              width={76}
              height={76}
              alt="이미지"
              className="absolute rounded-6 w-76 h-76 opacity-70 top-1/2 -translate-y-1/4"
            />
          )}
        </TaskLabel>
      </form>
      <div className="flex flex-row-reverse gap-12">
        <Button
          buttonType="modal2"
          bgColor="violet"
          textColor="white"
          disabled={!isRequiredFilled}
          onClick={handleEditClick}
        >
          수정
        </Button>
        <Button buttonType="modal2" bgColor="white" textColor="gray" onClick={handleModalClose}>
          취소
        </Button>
      </div>
    </Modal>
  );
};

export default EditTask;
