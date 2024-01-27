import Link from "next/link";

export default function ReturnToLoginButton() {
  return (
    <div className='text-center'>
      <h5 className='text-hyper-dark-grey text-[10px] font-medium tracking-tight'>
        Already have an account?
        <Link href={'/auth/login'} className='text-hyper-red'>
          Login Here!
        </Link>
      </h5>
    </div>
  )
}