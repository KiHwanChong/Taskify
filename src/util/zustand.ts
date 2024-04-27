import { create } from 'zustand';

type MembersData = {
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
