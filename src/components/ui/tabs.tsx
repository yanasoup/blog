import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = ({
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  return <TabsPrimitive.Root {...props} />;
};

const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      className={cn(
        // 'flex items-center border-b border-neutral-300',
        className
      )}
      {...props}
    />
  );
};

const TabsTrigger = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'group text-sm-regular md:text-sm-regular data-[state=active]:text-primary-300 relative h-11 flex-1 cursor-pointer px-7.75 text-center data-[state=active]:font-semibold md:h-11.5',
        className
      )}
      {...props}
    >
      {/* underline */}
      <div className='bg-primary-300 absolute inset-x-0 -bottom-0.25 h-0.75 group-data-[state=inactive]:h-0.5 group-data-[state=inactive]:bg-neutral-300' />
      {children}
    </TabsPrimitive.Trigger>
  );
};

const TabsContent = (
  props: React.ComponentProps<typeof TabsPrimitive.Content>
) => {
  return <TabsPrimitive.Content {...props} />;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
