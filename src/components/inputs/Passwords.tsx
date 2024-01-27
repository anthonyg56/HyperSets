import cn from '@/lib/utils/cn'
import { passwordRules } from '@/lib/utils/data'
import { recoveryPasswordSchema as passwordFormSchema, passwordSchema } from '@/lib/utils/schemas'
import React, { useState } from 'react'
import PasswordCheckIcon from '../icons/PasswordCheck'

/** Necessary to create in order to compare the two passwords while using server actions */
export default function PasswordInput() {
  const [state, setState] = useState({
    password: '',
    confirm: '',
  })

  const passwordSafeParsed = passwordSchema.refine(val => val.length > 1).safeParse({ password: state.password })
  const confirmSafeParsed = passwordSchema.refine(val => val.length > 1).safeParse({ confirm: state.confirm })
  const bothSafeParsed = passwordFormSchema.safeParse({ password: state.password, confirm: state.confirm })

  return (
    <>
      <div className='input-container'>
        <label htmlFor='password' className='label-text'>Password*</label>
        <input
          name='password'
          value={state.password}
          onChange={e => setState((prevState) => ({
            ...prevState,
            password: e.target.value,
          }))}
          className={cn([{
            'active:border-hyper-green !border-hyper-green border-[1px]': passwordSafeParsed.success,
            'active:border-hyper-red border-hyper-red outline-none': !passwordSafeParsed.success,
          }])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor='confirmPassword' className='label-text'>Password*</label>
        <input
          name='confirmPassword'
          value={state.confirm}
          onChange={e => setState((prevState) => ({
            ...prevState,
            confirmPassword: e.target.value,
          }))}
          className={cn([{
            'active:border-hyper-green !border-hyper-green border-[1px]': bothSafeParsed.success,
            'active:border-hyper-red border-hyper-red outline-none': !confirmSafeParsed.success,
          }])}
        />

        {passwordRules.map(item => (
          <div className='flex flex-row pb-2 items-center'>
            <PasswordCheckIcon validationCase={item} password={state.password} confirm={state.confirm} />
            <h4 className='sub-text-xs pl-1'>{item}</h4>
          </div>
        ))}
      </div>
    </>
  )
}
