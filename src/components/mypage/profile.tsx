import { FieldError, useForm } from 'react-hook-form';
import Image from 'next/image';
import add from '@/public/assets/icon/addViolet.svg';
import { useEffect, useState } from 'react';
import { getMyPageProfile, postMyPageProfile, putMyPageProfile } from '@/src/pages/api/mypageApi';
import { useMyProfileStore } from '@/src/util/zustand';
import Button from '../common/button';
import Input from '../common/input';
import SignModal from '../common/signModal';

interface InputForm {
  text?: string;
  email?: string;
  password?: string;
  newpassword?: string;
  passwordcheck?: string;
  checkbox?: boolean;
  file?: string;
}

const Profile = () => {
  const [temp, setTemp] = useState('');
  const setMyProfile = useMyProfileStore((state) => state.setMyProfile);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<InputForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: async () => {
      const response = await getMyPageProfile();
      setTemp(response.profileImageUrl);
      return { email: response.email, text: response.nickname, file: temp };
    },
  });

  const [open, setOpen] = useState(false);

  const handleModal = () => {
    setOpen(!open);
  };

  const imagefile = watch('file');

  useEffect(() => {
    if (imagefile && imagefile.length > 0) {
      setTemp(URL.createObjectURL(new Blob([imagefile[0]], { type: 'image/png' })));
    }
  }, [imagefile]);

  const onSubmit = async (data: InputForm) => {
    if (temp === null || temp === '') {
      handleModal();
    }
    if (data.file && data.file.length === 1) {
      const formdata = new FormData();
      formdata.append('image', data.file[0]);
      const response = await postMyPageProfile(formdata);
      const putdata = { nickname: data.text, profileImageUrl: response.profileImageUrl };
      const updatedMyProfile = await putMyPageProfile(putdata);
      setMyProfile(updatedMyProfile);
    } else {
      const putdata = { nickname: data.text, profileImageUrl: data.file ? data.file : '' };
      const updatedMyProfile = await putMyPageProfile(putdata);
      setMyProfile(updatedMyProfile);
    }
  };

  const handleBack = () => {
    setTemp('');
  };

  return (
    <div className="w-620 rounded-8 bg-white px-28 py-32 flex flex-col gap-37 mobile:gap-24 tablet:w-544 mobile:w-284">
      <p className="font-bold text-20">프로필</p>

      <form className="flex flex-row w-366 tablet:w-290 mobile:flex-col mobile:w-244" onSubmit={handleSubmit(onSubmit)}>
        <Input
          register={register('file', {})}
          type="file"
          inputName="file"
          labelId="file"
          focusType="file"
          divCheckStyle="flex items-center justify-center w-182 h-182 mr-16 py-0"
          inputCheckStyle="hidden "
          labelDropStyle="flex flex-col relative items-center justify-center w-182 h-182 border-2 bg-gray-fa border-dashed rounded-6 cursor-pointerdark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          {temp === null || temp === '' ? (
            <Image src={add} width={40} height={40} alt="add icon" />
          ) : (
            <>
              <Image
                src={temp}
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="rounded-6 "
                alt="profile"
              />

              <button
                onClick={handleBack}
                className="bg-violet w-25 h-25 border rounded-full text-white absolute -top-10 -left-10"
              >
                X
              </button>
            </>
          )}
        </Input>
        <div>
          <Input
            register={register('email', {
              disabled: true,
            })}
            type="email"
            clearError={clearErrors}
            error={errors.email as FieldError}
            inputName="email"
            inputContent="이메일을 입력해 주세요"
            labelId="email"
            labelText="이메일"
            focusType="email"
            inputCheckStyle="w-366 tablet:w-290 mobile:w-244"
            inputErrorFixStyle="w-366 tablet:w-290 mobile:w-244"
          />
          <Input
            register={register('text', {
              required: {
                value: true,
                message: '열 자 이하로 작성해주세요.',
              },
              pattern: {
                value: /^.{1,10}$/,
                message: '열 자 이하로 작성해주세요.',
              },
            })}
            type="text"
            clearError={clearErrors}
            error={errors.text as FieldError}
            inputName="text"
            inputContent="닉네임을 입력해 주세요"
            labelId="text"
            labelText="닉네임"
            inputCheckStyle="w-366 tablet:w-290 mobile:w-244"
            inputErrorFixStyle="w-366 tablet:w-290 mobile:w-244"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              buttonType="decision"
              bgColor="violet"
              textColor="white"
              disabled={!!errors.email || !!errors.text}
            >
              저장
            </Button>
          </div>
        </div>
      </form>
      <SignModal errorText="이미지는 필수 요소입니다." openModal={open} handleModalClose={handleModal} />
    </div>
  );
};

export default Profile;
