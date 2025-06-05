import { z } from 'zod';
import React, { useState } from 'react';
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

const formSchema = z
  .object({
    name: z
      .string({
        required_error: 'Please enter your name',
      })
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be at most 50 characters long'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    // .max(255, 'password is too long'),
    confirm_password: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type RegisterFormData = z.infer<typeof formSchema>;
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [loading, setLoading] = React.useState(false);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const togglePasswordVisibility = (
    caller: 'password' | 'confirm_password'
  ) => {
    if (caller === 'password') setShowPassword(!showPassword);
    else setShowPasswordConfirm(!showPasswordConfirm);
  };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.name === 'password') {
  //     setPassword(event.target.value);
  //   } else {
  //     setPasswordConfirm(event.target.value);
  //   }
  // };

  const onSubmit = async (data: RegisterFormData) => {
    // console.log('data', data);
    setLoading(true);
    await customAxios
      .post('/auth/register', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      })
      .then(function (response) {
        console.log('response', response.data);
      })
      .catch(function (error) {
        console.log('error', error);
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return (
    <div className='flex h-screen place-items-center justify-center'>
      <div className='w-90 rounded-xl border border-neutral-200 p-6 shadow-md shadow-neutral-300'>
        <h2 className='text-xl font-bold text-neutral-900'>Sign In</h2>

        <Form {...form}>
          <form
            className='mx-auto max-w-180 space-y-4 md:space-y-6'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...field}
                    className='text-sm-regular'
                    placeholder='Enter your name'
                    disabled={loading}
                    type='text'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
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
                      id='password'
                      // onChange={handleInputChange}
                      // value={password}
                    />
                    <div className='pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3'>
                      <button
                        type='button'
                        className='focus:outline-none'
                        onClick={() => togglePasswordVisibility('password')}
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
            <FormField
              control={form.control}
              name='confirm_password'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className='relative'>
                    <Input
                      {...field}
                      className='text-sm-regular'
                      placeholder='Enter your confirm password'
                      disabled={loading}
                      type={showPasswordConfirm ? 'text' : 'password'}
                      // onChange={handleInputChange}
                      // value={passwordConfirm}
                    />
                    <div className='pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3'>
                      <button
                        type='button'
                        className='focus:outline-none'
                        onClick={() =>
                          togglePasswordVisibility('confirm_password')
                        }
                      >
                        {showPasswordConfirm ? (
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

            <Button disabled={loading} type='submit'>
              {loading ? (
                <BeatLoader color='#d5d7da' className='text-white' size={16} />
              ) : (
                'Register'
              )}
            </Button>
            <p className='flex-center gap-1'>
              <span className='text-sm-regular text-neutral-950'>
                Already have an account?
              </span>
              <span className='text-primary-300 text-sm-semibold'>
                <NavLink to='/login'>Login</NavLink>
              </span>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
