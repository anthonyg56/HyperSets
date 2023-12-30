import Title from '@/components/reuseables/Title'
import React from 'react'
import Form from './components/Form'

export default function page() {
  return (
    <div className='container pt-[120px]'>
      <Title title='Create a Profile' sub='Share your creation with everyone!' />
      <Form />
    </div>
  )
}
