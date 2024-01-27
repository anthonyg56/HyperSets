import PasswordCheckIcon from '../icons/PasswordCheck'

type Props = {
  password: string;
  confirm: string | undefined;
}

export default function PasswordRequirements({ password, confirm }: Props) {
  return (
    <div>
      <div className='flex flex-row pb-2 items-center'>
        <PasswordCheckIcon validationCase='Must be at least 8 characters' password={password} />
        <h4 className='sub-text-xs pl-1'>Must be at least 8 characters </h4>
      </div>
      <div className='flex flex-row pb-2 items-center'>
        <PasswordCheckIcon validationCase='Must contain at least one uppercase character' password={password} />
        <h4 className='sub-text-xs pl-1'>Must contain at least one uppercase character</h4>
      </div>
      <div className='flex flex-row pb-2 items-center'>
        <PasswordCheckIcon validationCase='Must contain one special characters' password={password} />
        <h4 className='sub-text-xs pl-1'>Must contain one special characters</h4>
      </div>
      <div className='flex flex-row pb-2 items-center'>
        <PasswordCheckIcon validationCase='Must contain one number' password={password} />
        <h4 className='sub-text-xs pl-1'>Must contain one number</h4>
      </div>
      <div className='flex flex-row items-center pb-2'>
        <PasswordCheckIcon validationCase='Must contain one lowercase character' password={password} />
        <h4 className='sub-text-xs pl-1'>Must contain one lowercase character</h4>
      </div>
      <div className='flex flex-row items-center pb-2'>
        <PasswordCheckIcon validationCase='Passwords Match' password={password} confirm={confirm} />
        <h4 className='sub-text-xs pl-1'>Passwords Match</h4>
      </div>
    </div>
  )
}
