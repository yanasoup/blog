import { customAxios } from '@/lib/customAxios';
import type { AuthUser } from '@/redux/ui-slice';
import { useQuery } from '@tanstack/react-query';

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
