import { useEffect, useRef, useState } from 'react';
import { useCardId, useCardListStore, useIsCardFormatted } from '@/src/util/zustand';
import useModal from '@/src/hooks/useModal';
import { getCardList, getCardListAdditional } from '@/src/pages/api/cardListApi';
import Card from '../../common/card';
import ModalPortal from '../../common/modalPortal';
import { TaskCard } from '../../TaskModal/TaskCard';

const CardList = ({ columnId }: { columnId: number }) => {
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const { openModal: taskModal, handleModalClose: TaskModalClose, handleModalOpen: TaskModalOpen } = useModal();
  const { cardLists, setCardList } = useCardListStore();
  const isCardFormatted = useIsCardFormatted((state) => state.isCardFormatted);
  const setIsCardFormatted = useIsCardFormatted((state) => state.setIsCardFormatted);
  const cardList = cardLists[columnId] || { cards: [], totalCount: 0, cursorId: null };

  // 카드리스트 불러오기
  const getCards = async () => {
    try {
      const response = await getCardList({ column: columnId });
      const cardsData = response.cards;

      const newCardList = {
        cards: [...cardsData],
        totalCount: response.totalCount,
        cursorId: response.cursorId,
      };

      setCardList(columnId, newCardList);
      setHasMoreItems(cardsData.length > 0);
    } catch (error) {
      console.error(error);
    }
  };

  // 추가적으로 카드리스트 불러오기
  const getCardsAdditional = async () => {
    if (cardList.cursorId) {
      try {
        const response = await getCardListAdditional({ columnId: columnId, targetId: cardList.cursorId });
        const cardsData = response.cards;

        const newCardList = {
          cards: [...cardList.cards, ...cardsData],
          totalCount: response.totalCount,
          cursorId: response.cursorId,
        };
        setCardList(columnId, newCardList);
        setHasMoreItems(cardsData.length > 0);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getCards();
    setIsCardFormatted(false);
  }, [isCardFormatted]);

  // 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMoreItems) {
            getCardsAdditional();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [cardList.cursorId, hasMoreItems]);
  const setCardId = useCardId((state) => state.setCardId);

  const handleCardClick = (id: number) => {
    setCardId(id);
    TaskModalOpen();
  };

  return (
    <>
      <ModalPortal>
        <TaskCard openModal={taskModal} handleModalClose={TaskModalClose} />
      </ModalPortal>
      {cardList?.cards.map((card) => {
        return (
          <div key={card.id} onClick={() => handleCardClick(card.id)}>
            <Card
              src={card.imageUrl}
              profile={card.assignee?.profileImageUrl}
              title={card.title}
              date={card.dueDate}
              tags={card.tags}
            />
          </div>
        );
      })}
      <div ref={observerRef} />
    </>
  );
};

export default CardList;
