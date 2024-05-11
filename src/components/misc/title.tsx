
import { ClassValue } from 'clsx';
import { capitalizeEachWord, cn } from '@/lib/utils';
import { H3, Muted } from '../ui/typography';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

type NewProps = {
  title: string,
  subTitle?: string,
  center?: boolean,
  iconProps?: FontAwesomeIconProps,
  classNames?: ClassValue,
}

function Title({ title, subTitle, center, classNames, ...iconProps }: NewProps) {
  const titleText = capitalizeEachWord(title)
  // const titleIcon = icon ? <FontAwesomeIcon icon={icon} className='mx-auto  pb-2 text-hyper-dark-grey w-[30px] h-[30px]' /> : null

  return (
    <div className={cn([classNames, {
      "text-center flex justify-center flex-col": center
    }])}>
      {iconProps && iconProps.iconProps && iconProps.iconProps.icon !== undefined && <FontAwesomeIcon icon={iconProps.iconProps.icon} className={cn(['pb-2 text-hyper-dark-grey w-10 h-10', iconProps.iconProps.className])} {...iconProps} />}
      <H3>{titleText}</H3>
      {subTitle && <Muted>{subTitle}</Muted>}
      <br />
    </div>
  )
}

export default Title