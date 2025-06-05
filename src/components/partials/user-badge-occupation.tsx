import React from 'react';

type UserBadgeOccupationProps = {
  avatarUrl: string;
  name: string;
  occupation: string;
};
const UserBadgeOccupation: React.FC<UserBadgeOccupationProps> = ({
  avatarUrl,
  name,
  occupation = 'Frontend Developer',
}) => {
  return (
    <div className='flex items-center justify-start gap-3'>
      <img
        className='size-12.5 rounded-full object-contain'
        src={avatarUrl ? avatarUrl : 'https://placehold.co/50'}
      />
      <div className='items-left flex flex-col justify-center'>
        <span className='text-sm-bold md:text-md-bold text-left text-neutral-900'>
          {name}
        </span>
        <span className='text-sm-regular md:text-md-regular text-neutral-900'>
          {occupation}
        </span>
      </div>
    </div>
  );
};

export default UserBadgeOccupation;
