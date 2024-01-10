import Title from '@/components/reuseables/Title';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import React from 'react'

type Props = {
  isSubmitted: boolean;
}

export default function RegisterTitle(props: Props) {
  const { isSubmitted } = props
  const icon = isSubmitted ? faCircleCheck : undefined
  const title = isSubmitted ? 'Account Created' : 'Create An Account'
  const subTitle = isSubmitted ? 'Welcome! Happy to have you here. ❣️' : 'Please enter your details.'

  return (<Title
    title={title}
    sub={subTitle}
    icon={icon}
  />)
}
