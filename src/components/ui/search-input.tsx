import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
}
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  containerClassName = '',
  inputClassName = '',
}) => {
  return (
    <div className={cn('relative flex w-full flex-1', containerClassName)}>
      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5 text-gray-400'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
          />
        </svg>
      </div>
      <Input
        className={cn('w-full flex-1 pl-10', inputClassName)}
        placeholder={placeholder}
        type='text'
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};
