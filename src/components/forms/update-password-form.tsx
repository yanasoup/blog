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

import { BeatLoader } from 'react-spinners';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useBlogLogin } from '@/hooks/useAuth';
import { NavLink } from 'react-router';

const formSchema = z
  .object({
    current_password: z.string().min(1, 'Please enter your password'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    new_password_confirm: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters'),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: 'Passwords do not match',
    path: ['new_password_confirm'],
  });

type FormData = z.infer<typeof formSchema>;

type FormProps = {
  onSubmit: () => void;
  isLoading: boolean;
};
const UpdatePasswordForm: React.FC<FormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirm: '',
    },
  });
  const togglePasswordVisibility = (
    caller: 'current_password' | 'new_password' | 'new_password_confirm'
  ) => {
    if (caller === 'current_password') setShowPassword(!showPassword);
    else if (caller === 'new_password') setShowNewPassword(!showNewPassword);
    else setShowNewPasswordConfirm(!showNewPasswordConfirm);
  };

  return (
    <div>
      <Form {...form}>
        <form
          className='mx-auto max-w-180 space-y-4 md:space-y-6'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='current_password'
            render={({ field }) => (
              <FormItem className='mt-5 gap-1'>
                <FormLabel>Current Password</FormLabel>
                <div className='relative'>
                  <Input
                    {...field}
                    className='text-sm-regular'
                    placeholder='Enter your password'
                    disabled={isLoading}
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    // onChange={handleInputChange}
                    // value={password}
                  />
                  <div className='pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3'>
                    <button
                      type='button'
                      className='focus:outline-none'
                      onClick={() =>
                        togglePasswordVisibility('current_password')
                      }
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
            name='new_password'
            render={({ field }) => (
              <FormItem className='mt-5 gap-1'>
                <FormLabel>New Password</FormLabel>
                <div className='relative'>
                  <Input
                    {...field}
                    className='text-sm-regular'
                    placeholder='Enter new password'
                    disabled={isLoading}
                    type={showNewPassword ? 'text' : 'password'}
                    id='password'
                    // onChange={handleInputChange}
                    // value={password}
                  />
                  <div className='pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3'>
                    <button
                      type='button'
                      className='focus:outline-none'
                      onClick={() => togglePasswordVisibility('new_password')}
                    >
                      {showNewPassword ? (
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
            name='new_password_confirm'
            render={({ field }) => (
              <FormItem className='mt-5 gap-1'>
                <FormLabel>Confirm New Password</FormLabel>
                <div className='relative'>
                  <Input
                    {...field}
                    className='text-sm-regular'
                    placeholder='Enter confirm new password'
                    disabled={isLoading}
                    type={showNewPasswordConfirm ? 'text' : 'password'}
                    // onChange={handleInputChange}
                    // value={passwordConfirm}
                  />
                  <div className='pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3'>
                    <button
                      type='button'
                      className='focus:outline-none'
                      onClick={() =>
                        togglePasswordVisibility('new_password_confirm')
                      }
                    >
                      {showNewPasswordConfirm ? (
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

          <Button disabled={isLoading} type='submit'>
            {isLoading ? (
              <BeatLoader color='#d5d7da' className='text-white' size={16} />
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePasswordForm;
