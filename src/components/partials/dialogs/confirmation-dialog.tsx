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

interface FormStatusDialogProps extends React.ComponentProps<typeof Dialog> {
  title: string;
  description: string;
  onConfirm: (id: number) => void;
  onCancel?: () => void;
  showLoader?: boolean;
  postId: number;
}

const MyConfirmationDialog: React.FC<FormStatusDialogProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  showLoader,
  postId,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogBody
          className='mx-auto overflow-scroll px-4 py-6 md:px-6 md:py-6'
          style={{
            width: 'clamp(20rem, 42.63vw, 33.25rem)',
          }}
        >
          <DialogTitle className='flex items-center justify-between'>
            <p className='text-md-bold lg:text-xl-bold text-left text-neutral-950'>
              {title}
            </p>
            <DialogClose asChild>
              <XIcon size={24} className='cursor-pointer' />
            </DialogClose>
          </DialogTitle>
          <DialogDescription className='lg:text-md-regular text-sm-regular py-6 text-left text-neutral-600'>
            {description}
          </DialogDescription>

          <DialogDescription className='flex justify-end gap-1'>
            <DialogClose asChild>
              <Button
                disabled={showLoader}
                variant='ghost'
                className='text-xs-semibold lg:text-sm-semibold w-fit'
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={showLoader}
              onClick={() => onConfirm(postId)}
              variant='destructive'
              className='text-xs-semibold lg:text-sm-semibold text-neutral-25 w-fit'
            >
              {showLoader ? (
                <BeatLoader color='#d5d7da' className='text-white' size={10} />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogDescription>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default MyConfirmationDialog;
