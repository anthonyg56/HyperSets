import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as RadixIcons from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';

export const Icons = RadixIcons

export default <T extends keyof typeof Icons>(icon: T ) => {
  const Icon = Icons[icon];
  return Icon as React.FC<IconProps>;
}