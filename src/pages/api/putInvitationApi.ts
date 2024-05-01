import axios from '@/src/util/axios';

interface Inviter {
  id: number;
  email: string;
  nickname: string;
}

interface Dashboard {
  id: number;
  title: string;
}

interface Invitee {
  id: number;
  email: string;
  nickname: string;
}

interface InvitationResponse {
  id: number;
  inviter: Inviter;
  teamId: string;
  dashboard: Dashboard;
  invitee: Invitee;
  inviteAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

const putInvitation = async (invitationId: number, accept: boolean): Promise<InvitationResponse | undefined> => {
  try {
    if (localStorage.getItem('accessToken')) {
      const response = await axios.put<InvitationResponse>(`invitations/${invitationId}`, {
        inviteAccepted: accept,
      });
      return response.data;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    throw error;
  }
  return undefined;
};

export default putInvitation;
