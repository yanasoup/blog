import React from 'react';
import { cn } from '@/lib/utils';

type UserBadgeOccupationProps = {
  avatarUrl: string;
  name: string;
  occupation: string;
  avatarUrlClassName?: string;
  nameClassName?: string;
  occupationClassName?: string;
};
const UserBadgeOccupation: React.FC<UserBadgeOccupationProps> = ({
  avatarUrl,
  name,
  occupation = 'Frontend Developer',
  avatarUrlClassName,
  nameClassName,
  occupationClassName,
}) => {
  return (
    <div className='flex items-center justify-start gap-3'>
      <img
        className={cn(
          'size-12.5 rounded-full object-contain',
          avatarUrlClassName
        )}
        src={avatarUrl ? avatarUrl : 'https://placehold.co/50'}
      />
      <div className='items-left flex flex-col justify-center'>
        <span
          className={cn(
            'text-sm-bold md:text-md-bold text-left text-neutral-900',
            nameClassName
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            'text-sm-regular md:text-md-regular text-neutral-900',
            occupationClassName
          )}
        >
          {occupation}
        </span>
      </div>
    </div>
  );
};

export default UserBadgeOccupation;
