import { z } from 'zod';
import React, { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router';
import { customAxios } from '@/lib/customAxios';
import { BeatLoader } from 'react-spinners';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated } from '@/redux/ui-slice';
import type { RootState } from '@/redux/store';
import { useNavigate } from 'react-router';
import { useBlogLogin } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const formSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Please enter a valid email',
    })
    .min(1, 'Please enter your email')
    .email('Please enter a valid email'),
  password: z
    .string({
      required_error: 'Please enter your password',
    })
    .min(1, 'Please enter your password')
    .max(255, 'invalid password'),
});

type LoginFormData = z.infer<typeof formSchema>;
const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const uiuxState = useSelector((state: RootState) => state.uiux);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    data: loginResponse,
    mutate: loginFn,
    isSuccess,
    error,
    isPending,
  } = useBlogLogin();
  const onSubmit = async (data: LoginFormData) => {
    // console.log('form data', data);
    loginFn(data);
  };
  const getUsersHandler = async (email: string) => {
    const response = await customAxios.get(`/users/${email}`);
    return response.data;
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isSuccess) {
      async function getUserInfo() {
        const authUser = await getUsersHandler(emailRef.current?.value || '');
        dispatch(
          setAuthenticated({
            authUser: {
              ...authUser,
              avatarUrl: `${apiBaseUrl}${authUser.avatarUrl}`,
            },
            apiToken: loginResponse?.token!,
          })
        );
        toast.success('Login Success', {
          description: `Welcome back ${authUser.name}`,
        });
        navigate('/');
      }
      getUserInfo();
    } else if (error instanceof AxiosError) {
      toast.error('Login Failed!', {
        description: `${error?.response?.data?.message}`,
      });
    }
  }, [isSuccess, error, navigate, dispatch]);

  return (
    <div className='flex h-screen flex-col place-items-center justify-center'>
      <div className='bg-neutral-25 text-xs-regular mb-4 hidden min-h-50 w-90 overflow-scroll rounded-2xl border border-neutral-200 italic'>
        {JSON.stringify(uiuxState)}
      </div>
      <div className='w-90 rounded-xl border border-neutral-200 p-6 shadow-md shadow-neutral-300'>
        <h2 className='text-xl font-bold text-neutral-900'>Sign In</h2>
        <Form {...form}>
          <form
            className='mx-auto max-w-180 space-y-4 md:space-y-6'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    ref={emailRef}
                    className='text-sm-regular'
                    placeholder='Enter your email'
                    disabled={isPending}
                    type='email'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Password</FormLabel>
                  <div className='relative'>
                    <Input
                      {...field}
                      ref={passwordRef}
                      className='text-sm-regular'
                      placeholder='Enter your password'
                      disabled={isPending}
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                    />
                    <div className='pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3'>
                      <button
                        type='button'
                        className='focus:outline-none'
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOffIcon
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        ) : (
                          <EyeIcon
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type='submit' className='mt-5'>
              {isPending ? (
                <BeatLoader color='#d5d7da' className='text-white' size={16} />
              ) : (
                'Login'
              )}
            </Button>
            <p className='flex-center gap-1'>
              <span className='text-sm-regular text-neutral-950'>
                Don't have an account?
              </span>
              <span className='text-primary-300 text-sm-semibold'>
                <NavLink to='/register'>Register</NavLink>
              </span>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
