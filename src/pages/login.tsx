import { z } from 'zod';
import React, { useRef, useState } from 'react';
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

const formSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Please enter a valid email',
    })
    .email('Please enter your email'),
  password: z
    .string({
      required_error: 'Please enter your password',
    })
    .max(255),
});

type LoginFormData = z.infer<typeof formSchema>;
const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
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

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    await customAxios
      .post('/auth/login', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      })
      .then(async function (response) {
        const authUser = await getUsersHandler(data.email);
        dispatch(
          setAuthenticated({
            authUser: authUser,
            apiToken: response.data.token,
          })
        );
        navigate('/');
      })
      .catch(function (error) {
        toast('Login Failed', {
          description: `failed to login: ${error}`,
          action: {
            label: 'Ok',
            onClick: () => console.log('Ok'),
          },
        });
      })
      .finally(function () {
        setLoading(false);
      });
  };

  const getUsersHandler = async (email: string) => {
    const response = await customAxios.get(`/users/${email}`);
    return response.data;
  };
  const emailRef = useRef<HTMLInputElement>(null);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
                    disabled={loading}
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
                      className='text-sm-regular'
                      placeholder='Enter your password'
                      disabled={loading}
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
            <Button disabled={loading} type='submit' className='mt-5'>
              {loading ? (
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
