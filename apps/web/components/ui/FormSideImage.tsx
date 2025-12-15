import React from 'react'
import Image from 'next/image'
const FormSideImage = () => {
  return (
    
        <div className="w-full h-100 md:h-190 relative">
          <Image
            src={`/assets/signup_form/bfd700b0e493c1d48adf286de20d6404d2059543.jpg`}
            alt="sign up "
            fill
            className="rounded-2xl object-cover"
          />
        </div>
  )
}

export default FormSideImage