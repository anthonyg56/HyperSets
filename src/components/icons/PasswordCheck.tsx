import React from 'react'
import { ZodString, z } from 'zod'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

import cn from '@/lib/utils/cn'
import {  passwordSchema, } from '@/lib/utils/schemas'

export type ValidationCase = 
  'Must be at least 8 characters' |
  'Must contain at least one uppercase character' |
  'Must contain one special characters' |
  'Must contain one number' |
  'Must contain one lowercase character' |
  'Passwords Match'

type Props = {
  password: string,
  confirm?: string,
  validationCase: ValidationCase,
  fontAwesomeIconProps?: FontAwesomeIconProps
}

export default function PasswordCheckIcon({ validationCase, password, confirm, ...props }: Props) {
  const validatePassword = () => {
    let schema: ZodString | z.ZodEffects<z.ZodObject<{
      password: z.ZodString;
      confirm: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        confirm: string;
    }, {
        password: string;
        confirm: string;
    }>, {
        password: string;
        confirm: string;
    }, {
        password: string;
        confirm: string;
    }> // This monstroscity is because i added refine to a schema

    switch (validationCase) {
      case 'Must be at least 8 characters':
        schema = z.string().min(8)
        break;
      case 'Must contain at least one uppercase character':
        schema = z.string().regex(/[A-Z]/)
        break;
      case 'Must contain one special characters':
        schema = z.string().regex(/[ -/:-@[-`{-~]/)
        break;
      case 'Must contain one number':
        schema = z.string().regex(/\d/)
        break;
      case 'Must contain one lowercase character':
        schema = z.string().regex(/(?=.*[a-z])/,)
        break;
      case 'Passwords Match':
        schema = z.object({
          password: passwordSchema,
          confirm: passwordSchema,
        })
        .refine((data) => data.password === data.confirm, {
          message: "Passwords don't match",
          path: ["confirm"], // path of error
        })
        break;
      default:
        schema = z.string()
        break
    }

    const isMatchCase = validationCase === 'Passwords Match'
    const parseValuse = isMatchCase ? { password, confirm } : password

    const results = schema.safeParse(parseValuse)

    return results.success
  }

  const isValid = validatePassword()

  return <FontAwesomeIcon icon={faCircleCheck} className={cn(["text-hyper-dark-grey", {
      "text-hyper-red": isValid
    }])}
    {...props}
  />
}
