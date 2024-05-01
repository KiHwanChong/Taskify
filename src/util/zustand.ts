import { create } from 'zustand';

export type MembersData = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  isOwner: boolean;
  userId: number;
};

type MembersStore = {
  membersData: MembersData[];
  setMembersData: (data: MembersData[]) => void;
  offset: number;
  setOffset: (offset: number) => void;
  maxOffset: number;
  setMaxOffset: (maxOffset: number) => void;
};

export const useMembersStore = create<MembersStore>((set) => ({
  membersData: [],
  setMembersData: (data) => set(() => ({ membersData: data })),
  offset: 1,
  setOffset: (offset) => set({ offset }),
  maxOffset: 1,
  setMaxOffset: (maxOffset) => set({ maxOffset }),
}));

type TotalMembersStore = {
  totalMembersData: MembersData[];
  setTotalMembersData: (data: MembersData[]) => void;
};

export const useTotalMembersStore = create<TotalMembersStore>((set) => ({
  totalMembersData: [],
  setTotalMembersData: (data) => set(() => ({ totalMembersData: data })),
}));

type NestedInvitee = {
  id: number;
  email: string;
  nickname: string;
};

type InviteesData = {
  id: number;
  invitee: NestedInvitee;
};

type InviteesStore = {
  inviteesData: InviteesData[];
  setInviteesData: (data: InviteesData[]) => void;
  offset: number;
  setOffset: (offset: number) => void;
  maxOffset: number;
  setMaxOffset: (maxOffset: number) => void;
};

export const useInviteesStore = create<InviteesStore>((set) => ({
  inviteesData: [],
  setInviteesData: (data) => set(() => ({ inviteesData: data })),
  offset: 1,
  setOffset: (offset) => set({ offset }),
  maxOffset: 1,
  setMaxOffset: (maxOffset) => set({ maxOffset }),
}));

export interface Dashboard {
  id: number;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  createdByMe: boolean;
  userId: number;
}

export type SelectedDashboard = {
  id: number;
  title: string;
  color: string;
  createdByMe?: boolean;
};

type DashboardListStore = {
  dashboardListData: Dashboard[];
  setDashboardListData: (data: Dashboard[]) => void;
  offset: number;
  setOffset: (offset: number) => void;
  maxOffset: number;
  setMaxOffset: (maxOffset: number) => void;
  selectedDashboard: SelectedDashboard;
  setSelectedDashboard: (data: SelectedDashboard) => void;
};

export const useDashboardListStore = create<DashboardListStore>((set) => ({
  dashboardListData: [],
  setDashboardListData: (data) => set({ dashboardListData: data }),
  offset: 1,
  setOffset: (offset) => set({ offset }),
  maxOffset: 1,
  setMaxOffset: (maxOffset) => set({ maxOffset }),
  selectedDashboard: { id: 0, title: '', color: '' },
  setSelectedDashboard: (data) => set({ selectedDashboard: data }),
}));

type CardId = {
  cardId: number;
  setCardId: (id: number) => void;
};

export const useCardId = create<CardId>((set) => ({
  cardId: 0,
  setCardId: (id) => set({ cardId: id }),
}));

interface CardType {
  id: number;
  title: string;
  description: string;
  tags: string[] | [];
  dueDate?: string;
  assignee?: { id: number; nickname: string; profileImageUrl?: string };
  imageUrl?: string;
  teamId: string;
  dashboardId: number;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

interface CardListType {
  cards: CardType[] | [];
  totalCount: number;
  cursorId: number | null;
}

interface CardListStore {
  cardLists: { [columnId: number]: CardListType };
  setCardList: (columnId: number, cardList: CardListType) => void;
}

export const useCardListStore = create<CardListStore>((set) => ({
  cardLists: {},
  setCardList: (columnId, cardList) => set((state) => ({ cardLists: { ...state.cardLists, [columnId]: cardList } })),
}));

type MyProfile = {
  email: string;
  nickname: string;
  profileImageUrl: string;
};

type ProfileStore = {
  myProfile: MyProfile;
  setMyProfile: (data: MyProfile) => void;
};

export const useMyProfileStore = create<ProfileStore>((set) => ({
  myProfile: { email: '', nickname: '', profileImageUrl: '' },
  setMyProfile: (data) => set({ myProfile: data }),
}));

type MyDashboardListStore = {
  myDashboardList: Dashboard[];
  setMyDashboardList: (dashboards: Dashboard[]) => void;
};

export const useMyDashboardListStore = create<MyDashboardListStore>((set) => ({
  myDashboardList: [],
  setMyDashboardList: (dashboards) => set({ myDashboardList: dashboards }),
}));

export type Column = {
  id: number;
  dashboardId: number;
  teamId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
type ColumnList = {
  columnList: Column[];
  setColumnList: (columnList: Column[]) => void;
};

export const useColumnList = create<ColumnList>((set) => ({
  columnList: [],
  setColumnList: (columns: Column[]) => {
    set({ columnList: columns });
  },
}));

type IsCardFormatted = {
  isCardFormatted: boolean;
  setIsCardFormatted: (isFormatted: boolean) => void;
};

export const useIsCardFormatted = create<IsCardFormatted>((set) => ({
  isCardFormatted: false,
  setIsCardFormatted: (isFormatted) => {
    set({ isCardFormatted: isFormatted });
  },
}));

interface Inviter {
  nickname: string;
  email: string;
  id: number;
}

interface InvitedDashboard {
  title: string;
  id: number;
}

export interface Invitation {
  id: number;
  inviter: Inviter;
  dashboard: InvitedDashboard;
}

type InvitationList = {
  invitationList: Invitation[];
  setInvitationList: (invitations: Invitation[]) => void;
  searchedInvitationList: Invitation[];
  setSearchedInvitationList: (invitations: Invitation[]) => void;
  removeInvitation: (invitationId: number) => void; // Add the removeInvitation function
};

export const useInvitationList = create<InvitationList>((set) => ({
  invitationList: [],
  setInvitationList: (invitations) => {
    set({ invitationList: invitations });
  },
  searchedInvitationList: [],
  setSearchedInvitationList: (invitations) => {
    set({ searchedInvitationList: invitations });
  },
  removeInvitation: (invitationId) => {
    set((state) => ({
      invitationList: state.invitationList.filter((invitation) => invitation.id !== invitationId),
      searchedInvitationList: state.searchedInvitationList.filter((invitation) => invitation.id !== invitationId),
    }));
  },
}));
