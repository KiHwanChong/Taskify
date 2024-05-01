import FormatDate from '@/src/util/dateFormat';
import Image from 'next/image';
import { useCardId } from '@/src/util/zustand';
import { MouseEventHandler, useState, useEffect } from 'react';
import calender from '@/public/assets/icon/calendar.svg';
import Chip from '../chip';

interface CardInfo {
  id: number;
  src?: string;
  title: string;
  date?: string;
  profile?: string;
  tags: string[] | [];
  onClick: MouseEventHandler<HTMLButtonElement>;
}

/**
 * 카드 컴포넌트
 * @param src: 이미지 주소
 * @param title: 제목 30자 이상 시 말줄임표
 * @param date: 날짜 별도의 변환 없이 string 형식으로 입력
 */
const Card = ({ id, src, title, date, profile, tags, onClick }: CardInfo) => {
  const setCardId = useCardId((state) => state.setCardId);
  const titleShort = title.length > 30 ? `${title.slice(0, 29)}...` : title;
  const formattedDate = date ? FormatDate(date) : undefined;
  const [formattedTags, setFormattedTags] = useState(tags.slice(0, 3));

  useEffect(() => {
    const handleResize = () => {
      const viewWidth = window.innerWidth;
      if (viewWidth >= 1200) setFormattedTags(tags.slice(0, 3));
      else if (viewWidth < 1200 && viewWidth >= 768) setFormattedTags(tags.slice(0, 2));
      else if (viewWidth < 768) setFormattedTags(tags.slice(0, 1));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCardClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setCardId(id);
    onClick(e);
  };

  return (
    <button
      onClick={handleCardClick}
      className="text-left tablet:max-w-full max-w-450 rounded-6 p-16 border-1 border-gray-d9 bg-white hover:bg-violet-8%"
    >
      <div className="flex mobile:flex-col tablet:flex-row flex-col justify:start items-center gap-12">
        {src && (
          <div className="rounded-6 mobile:w-full tablet:w-90 w-full tablet:h-full mobile:h-full mobile:max-h-none">
            <Image src={src} width={700} height={700} alt="Card Image" className="rounded-6" priority />
          </div>
        )}
        <div className="w-full flex flex-col gap-10">
          <span className="text-black font-medium">{titleShort}</span>
          <div className="flex relative mobile:flex-col tablet:flex-row flex-col gap-16 overflow-auto">
            {formattedTags.length !== 0 && (
              <div className="flex flex-row w-full tablet:w-fit flex-wrap flex-none justify-start gap-6">
                {formattedTags.map((tag) => {
                  return <Chip key={tag}>{tag}</Chip>;
                })}
              </div>
            )}
            <div className="flex flex-row justify-between content-center w-full">
              {formattedDate && (
                <div className="flex flex-row gap-6">
                  <div className="w-18 h-18">
                    <Image src={calender} width={18} height={18} alt="date" className="inline-block" />
                  </div>
                  <span className="font-medium text-gray-78">{formattedDate}</span>
                </div>
              )}
              {profile && (
                <div className="w-24 h-24 rounded-99 overflow-hidden absolute bottom-0 right-0">
                  <Image src={profile} layout="fill" objectFit="cover" objectPosition="top" alt="profileImg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Card;
