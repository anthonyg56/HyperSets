import { ClassNameValue } from 'tailwind-merge';
import { ClassValue } from 'clsx';
import { capitalizeEachWord, cn } from '@/lib/utils';
import { H2, H3, H4, Muted } from '../ui/typography';

type NewProps = {
  title: string,
  subTitle?: string,
  center?: boolean,
  // icon?: IconProp,
  classNames?: ClassValue,
}

function Title({ title, subTitle, center, classNames }: NewProps) {
  const titleText = capitalizeEachWord(title)
  // const titleIcon = icon ? <FontAwesomeIcon icon={icon} className='mx-auto  pb-2 text-hyper-dark-grey w-[30px] h-[30px]' /> : null

  return (
    <div className={cn([classNames, {
      "text-center": center
    }])}>
      {/* {titleIcon} */}
      <H3>{titleText}</H3>
      {subTitle && <Muted>{subTitle}</Muted>}
      <br />
    </div>
  )
}

export default Title