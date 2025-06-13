import React from 'react';
import { cn } from '@/lib/utils';
import IconUser from '@/assets/icons/icon-user.svg';
import { BeatLoader } from 'react-spinners';

type UserBadgeOccupationProps = {
  avatarUrl: string;
  name: string;
  occupation: string;
  avatarUrlClassName?: string;
  nameClassName?: string;
  occupationClassName?: string;
  size?: number;
};
const UserBadgeOccupation: React.FC<UserBadgeOccupationProps> = ({
  avatarUrl = '',
  name,
  occupation = 'Frontend Developer',
  avatarUrlClassName = '',
  nameClassName,
  occupationClassName,
  size = 12.5,
}) => {
  return (
    <div className='flex items-center justify-start gap-3'>
      {/* <img
        className={cn(
          'size-12.5 rounded-full object-contain',
          avatarUrlClassName
        )}
        src={avatarUrl ? avatarUrl : 'https://placehold.co/50'}
      /> */}
      <UserBadge
        className={avatarUrlClassName}
        avatarUrl={avatarUrl}
        size={size}
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

type UserBadgeProps = {
  avatarUrl: string;
  size: number;
  className?: string;
};
export const UserBadge: React.FC<UserBadgeProps> = ({
  avatarUrl,
  size,
  className = '',
}) => {
  const [isLoadError, setIsLoadError] = React.useState(false);
  const [isAvatarLoaded, setIsAvatarLoaded] = React.useState(false);
  const defaultIcon = IconUser;

  return (
    <div className='relative'>
      {!isAvatarLoaded && (
        <div className='absolute inset-0 z-2 flex items-center justify-start'>
          <BeatLoader color='#d5d7da' size={size - 2} />
        </div>
      )}

      <img
        className={cn(`size-${size} rounded-full object-contain`, className)}
        src={isLoadError || !avatarUrl ? defaultIcon : avatarUrl}
        onError={() => setIsLoadError(true)}
        onLoad={() => setIsAvatarLoaded(true)}
      />
    </div>
  );
};

export default UserBadgeOccupation;
