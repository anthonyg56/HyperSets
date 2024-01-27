import Link from 'next/link';
import { createSupabaseServerClient, fetchProfileByUserId, validateRouteUuid } from '@/lib/supabase/server';
// import Avatar from '../../../../../components/misc/avatar';
import capitalizeEachWord from '@/lib/utils/capitalize';
import { faUser, faAngleRight, faAt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    userId: string;
  }
}

export default async function page(props: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()
  const { userId } = props.params

  if (!session) {
    redirect('/auth/login')
  }

  validateRouteUuid({ 
    routeUuid: userId,
    userId: session.user.id 
  }, { 
    path: 'account'
  })

  const profile = await fetchProfileByUserId(userId)
  
  return (
    <div className='container pt-[120px] flex flex-col items-center'>
      {/* <Avatar userId={user.id} editMode={true} /> */}
      <h4 className='sub-text'>Your Account Settings</h4>

      <div className='flex flex-col gap-y-3 w-full pt-[25px]'>
        <Link className='flex flex-row' href={`/auth/${userId}/settings/account/name`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center '>
            <FontAwesomeIcon icon={faUser} width={16} height={16} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full ml-3 pb-2 border-b-2 border-hyper-grey'>
            <h4 className='sub-text my-auto font-medium'>Name</h4>
            <p className='ml-auto my-auto sub-text-xs-grey'>
              {profile?.name ? capitalizeEachWord(profile.name) : 'Create a Name'}
            </p>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-1 my-auto text-hyper-grey' />
          </div>
        </Link>

        <Link className='flex flex-row' href={`/auth/${userId}/settings/account/email`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center'>
            <FontAwesomeIcon icon={faAt} width={16} height={16} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full ml-3 pb-2 border-b-2 border-hyper-grey'>
            <h4 className='sub-text my-auto font-medium'>Email</h4>
            <h2 className='ml-auto my-auto sub-text-xs-grey'>{profile?.email}</h2>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-1 my-auto text-hyper-grey' />
          </div>
        </Link>

        <Link className='flex flex-row' href={`/auth/${userId}/settings/account/password`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center'>
            <FontAwesomeIcon width={16} height={16} icon={faDownload} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full ml-3 pb-1 '>
            <h4 className='sub-text my-auto font-medium'>Password</h4>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-auto my-auto text-hyper-grey' />
          </div>
        </Link>
      </div>

      <Link href={`/auth/${userId}/settings`} className='text-sm text-center button-auto w-full mt-[30px]'>Go Back To Settings</Link>
    </div>
  )
}
