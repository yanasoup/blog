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
