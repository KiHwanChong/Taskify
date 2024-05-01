import instance from '@/src/util/axios';
import axios from 'axios';

interface BodyProps {
  email: string;
  password: string;
  nickname?: string;
}

const postUser = async (url: string, body: BodyProps) => {
  try {
    const response = await instance.post(`/${url}`, body);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
  }
  return false;
};

export default postUser;
