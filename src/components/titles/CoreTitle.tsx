import { ClassNameValue } from 'tailwind-merge';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import capitalizeEachWord from '@/lib/utils/capitalize';
import cn from '@/lib/utils/cn';
import { ClassValue } from 'clsx';

type NewProps = {
  title: string,
  subTitle?: string,
  isUpper?: boolean,
  icon?: IconProp,
  bottomPadding?: ClassNameValue,
  classNames?: ClassValue,
}

function CoreTitle({ title, subTitle, bottomPadding, icon, isUpper, classNames }: NewProps) {
  const titleText = capitalizeEachWord(title)
  const titleIcon = icon ? <FontAwesomeIcon icon={icon} className='mx-auto  pb-2 text-hyper-dark-grey w-[30px] h-[30px]' /> : null

  return (
    <div className={cn([ 'text-container', classNames, bottomPadding ?? 'pb-[50px]' ])}>
      {titleIcon}
      <h2 className={cn([ isUpper ? 'title-2xl-upper' : 'title-2xl' ])}>{titleText}</h2>
      <h4 className='sub-text'>{subTitle}</h4>
    </div>
  )
}

export default CoreTitle