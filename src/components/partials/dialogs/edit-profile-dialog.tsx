import React from 'react';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../ui/dialog';
import { XIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { BeatLoader } from 'react-spinners';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Icon } from '@iconify-icon/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UpdateProfileParams } from '@/hooks/useAuth';
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const formSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Please enter your name',
    })
    .min(1, 'Please enter your name'),
  profileHeadline: z
    .string({
      required_error: 'Please enter your headline',
    })
    .min(1, 'Please enter your password')
    .max(255, 'invalid password'),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, and .png formats are supported.'
    ),
});

type FormData = z.infer<typeof formSchema>;
interface DialogProps extends React.ComponentProps<typeof Dialog> {
  onConfirm: (params: UpdateProfileParams) => void;
  showLoader?: boolean;
}

const EditProfileDialog: React.FC<DialogProps> = ({
  onConfirm,
  showLoader = false,
  ...props
}) => {
  const uiuxState = useSelector((state: RootState) => state.uiux);
  // const nameRef= React.useRef<HTMLInputElement>(null);
  // const headlineRef= React.useRef<HTMLInputElement>(null);
  // const [inputName, setInputName] = React.useState(uiuxState.authUser?.name);
  // const [inputHeadline, setInputHeadline] = React.useState(
  //   uiuxState.authUser?.headline
  // );
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      profileHeadline: '',
    },
  });

  function handleSubmit(formData: FormData) {
    const updateParams: UpdateProfileParams = {
      name: formData.name,
      headline: formData.profileHeadline,
      avatar: selectedImage,
      authToken: uiuxState.apiToken!,
    };
    onConfirm(updateParams);
  }

  React.useEffect(() => {
    form.setValue('name', uiuxState.authUser?.name!);
    form.setValue('profileHeadline', uiuxState.authUser?.headline!);
  }, [uiuxState.authUser?.name, uiuxState.authUser?.headline]);

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogBody
          className='mx-auto overflow-scroll px-4 py-6 md:px-6 md:py-6'
          style={{
            width: 'clamp(20rem, 42.63vw, 29rem)',
          }}
        >
          <DialogTitle className='flex items-center justify-between'>
            <p className='text-md-bold lg:text-xl-bold text-left text-neutral-950'>
              Edit Profile
            </p>
            <DialogClose asChild>
              <XIcon size={24} className='cursor-pointer' />
            </DialogClose>
          </DialogTitle>
          <DialogDescription className='hidden' />
          <div className='lg:text-md-regular text-sm-regular text-left text-neutral-600'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem className='mt-5 gap-1'>
                      <FormControl>
                        <div className='flex-center relative p-4'>
                          <input
                            type='file'
                            className='hidden'
                            id='fileInput'
                            accept='image/*'
                            onBlur={field.onBlur}
                            name={field.name}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setSelectedImage(e.target.files?.[0] || null);
                            }}
                            ref={field.ref}
                            disabled={showLoader}
                          />
                          {selectedImage && (
                            <div className=''>
                              <img
                                src={URL.createObjectURL(selectedImage)}
                                alt='Selected'
                                className='size-20 overflow-clip rounded-full object-cover'
                              />
                            </div>
                          )}
                          {!selectedImage && (
                            <img
                              src={
                                uiuxState.authUser?.avatarUrl
                                  ? uiuxState.authUser?.avatarUrl
                                  : 'https://placehold.co/80'
                              }
                              alt='avatar'
                              className='size-20 max-h-20 max-w-20 overflow-clip rounded-full object-contain'
                            />
                          )}

                          <label
                            htmlFor='fileInput'
                            className='text-neutral-90 bg-primary-300 absolute bottom-1 left-1/2 inline-flex cursor-pointer items-center rounded-full border border-neutral-300 p-0'
                          >
                            <Icon
                              icon='icon-park-solid:camera'
                              className='bg-primary-300 flex-center size-8 rounded-full text-white'
                            />
                          </label>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='mt-5 gap-1'>
                      <FormLabel className='text-sm-semibold lg:text-md-semibold text-neutral-950'>
                        Name
                      </FormLabel>
                      <Input
                        {...field}
                        className='text-sm-regular'
                        placeholder='Enter your name'
                        disabled={showLoader}
                        type='text'
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='profileHeadline'
                  render={({ field }) => (
                    <FormItem className='mt-5 gap-1'>
                      <FormLabel>Profile Headline</FormLabel>
                      <Input
                        {...field}
                        className='text-sm-regular'
                        placeholder='Enter your headline'
                        disabled={showLoader}
                        type='text'
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogDescription className='mt-5'>
                  <Button
                    disabled={showLoader}
                    // onClick={onConfirm}
                    variant='default'
                    className='text-xs-semibold lg:text-sm-semibold text-neutral-25'
                  >
                    {showLoader ? (
                      <BeatLoader
                        color='#d5d7da'
                        className='text-white'
                        size={10}
                      />
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </DialogDescription>
              </form>
            </Form>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
