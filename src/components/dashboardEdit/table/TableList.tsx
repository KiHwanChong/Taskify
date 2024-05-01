import Image from 'next/image';
import { ReactNode } from 'react';
import crown from '@/public/assets/icon/crown.svg';
import InitialImage from '../../common/navigation/ProfileImage';

interface TableListProps {
  src?: string;
  text: string;
  button: ReactNode;
  isOwner?: boolean;
}

const TableList = ({ src, text, button, isOwner }: TableListProps) => {
  return (
    <div className="flex items-center justify-between border-b-1 py-16">
      <div className="flex gap-12 items-center">
        {src ? (
          <div className="w-30 h-30 overflow-hidden rounded-99">
            <Image src={src} alt="last name initial" width={30} height={30} className="rounded-99" />
          </div>
        ) : (
          <InitialImage nickname={text} />
        )}
        {text}
        {isOwner && <Image src={crown} alt="crown" width={18} />}
      </div>
      {!isOwner && button}
    </div>
  );
};

export default TableList;
