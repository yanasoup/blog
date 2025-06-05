import { useSelector } from 'react-redux';
import { RootState } from './store';
import { cn } from '@/lib/utils';

const DebugBox = ({ visible = true }: { visible: boolean }) => {
  const uiuxState = useSelector((state: RootState) => state.uiux);
  return (
    <div
      className={cn(
        'custom-container text-xs-regular min-h-25 w-full overflow-scroll rounded-lg border border-dashed border-neutral-400 bg-neutral-100 p-2',
        visible ? 'block' : 'hidden'
      )}
    >
      {JSON.stringify(uiuxState)}
    </div>
  );
};

export default DebugBox;
