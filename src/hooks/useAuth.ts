import { customAxios } from '@/lib/customAxios';
import type { AuthUser } from '@/redux/ui-slice';
import { useQuery, useMutation } from '@tanstack/react-query';

async function getUser(email: string): Promise<AuthUser> {
  const response = await customAxios.get(`/users/${email}`);
  return response.data;
}

export const useGetUser = (email: string) => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: () => getUser(email),
    enabled: !!email,
  });
};

type BlogLoginParams = {
  email: string;
  password: string;
};
type BlogLoginResponse = {
  token: string;
};

export const useBlogLogin = () => {
  return useMutation({
    mutationFn: (params: BlogLoginParams) => blogLogin(params),
  });
};

export const blogLogin = async ({ email, password }: BlogLoginParams) => {
  const response = await customAxios.post<BlogLoginResponse>(
    '/auth/login',
    { email, password },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  );
  return response.data;
};

export type useUpdatePasswordParams = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  authToken: string;
};
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (params: useUpdatePasswordParams) => updatePassword(params),
  });
};

export const updatePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
  authToken,
}: useUpdatePasswordParams) => {
  const response = await customAxios.patch<BlogLoginResponse>(
    '/users/password',
    { currentPassword, newPassword, confirmPassword },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
};

export type UpdateProfileParams = {
  name: string;
  headline: string;
  avatar: any;
  authToken: string;
};
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (params: UpdateProfileParams) => updateProfile(params),
  });
};

export const updateProfile = async (params: UpdateProfileParams) => {
  const apiParams = {
    name: params.name,
    headline: params.headline,
    avatar: params.avatar,
  };
  const response = await customAxios.patch('/users/profile', apiParams, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: '*/*',
      Authorization: `Bearer ${params.authToken}`,
    },
  });

  return response.data;
};
