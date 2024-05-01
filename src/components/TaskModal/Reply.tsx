import { deleteComment, putComment } from '@/src/pages/api/comments';
import { format } from 'date-fns';
import { ChangeEventHandler, Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import ProfileImage from '../common/navigation/ProfileImage';

interface Props {
  id: number;
  nickname: string;
  profile?: string;
  date: string;
  content: string;
  currentEditing: number;
  setCurrentEditing: Dispatch<SetStateAction<number>>;
  setIsCommentFormatted: Dispatch<SetStateAction<boolean>>;
}

const Reply = ({
  id,
  nickname: name,
  profile,
  date,
  content,
  currentEditing,
  setCurrentEditing,
  setIsCommentFormatted,
}: Props) => {
  const formattedDate = format(new Date(date), 'yyyy.MM.dd HH:mm');
  const [replyValue, setReplyValue] = useState<string>(content);

  const handleEditCommentClick = () => {
    setCurrentEditing(id);
  };
  const handleEditCancel = () => {
    setCurrentEditing(0);
    setReplyValue(content);
  };
  const handleReplyChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setReplyValue(e.target.value);
  };
  const handleEditSubmit: MouseEventHandler<HTMLButtonElement> = () => {
    putComment(id, replyValue);
    setCurrentEditing(0);
    setIsCommentFormatted(true);
  };
  const handleCommentDelete: MouseEventHandler<HTMLButtonElement> = () => {
    deleteComment(id);
    setIsCommentFormatted(true);
  };

  return (
    <div className="flex gap-8">
      <ProfileImage src={profile} nickname={name} className="flex-shrink-0" />
      <div className="flex flex-col gap-4">
        <div className="flex gap-8">
          <p className="text-14 font-semibold">{name}</p>
          <p className="text-12 font-normal text-gray-9f">{formattedDate}</p>
        </div>
        {currentEditing === id ? (
          // <div className="p-16 border-1 border-gray-d9 rounded-6 focus-within:border-violet">
          //   <div className="flex flex-row justify-end gap-4 mt-4">
          //     <button
          //       className="text-12 border rounded-6 border-gray-df px-31 py-6 bg-white text-black"
          //       onClick={handleEditCancel}
          //     >
          //       취소
          //     </button>
          //     <button
          //       className={`text-12 border rounded-6 border-gray-df px-31 py-6 ${
          //         content ? 'bg-white text-violet' : 'bg-gray-50 text-gray-78'
          //       }`}
          //       onClick={handleEditSubmit}
          //     >
          //       수정
          //     </button>
          //   </div>
          // </div>
          <>
            <textarea
              className="resize-none text-14 font-normal w-412 border-1 rounded-6 border-gray-d9 p-16 focus:border-violet"
              rows={4}
              value={replyValue}
              onChange={handleReplyChange}
            />

            <div className="flex flex-row gap-12 text-12 text-gray-9f">
              <button className="underline" onClick={handleEditSubmit}>
                수정
              </button>
              <button className="underline" onClick={handleEditCancel}>
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-14 font-normal whitespace-pre-wrap">{content}</div>
            <div className="flex flex-row gap-12 text-12 text-gray-9f">
              <button className="underline" onClick={handleEditCommentClick}>
                수정
              </button>
              <button className="underline" onClick={handleCommentDelete}>
                삭제
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reply;
