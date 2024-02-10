import { PasswordValidation, passwordRules } from "@/lib/data";
import { passwordSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ZodString, z } from "zod";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

type IconProps = {
  password: string;
  confirm?: string | undefined;
  validationCase: PasswordValidation
}

function PasswordCheckIcon({ password, confirm, validationCase, ...props }: IconProps) {
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

type Props = {
  password: string;
  confirm: string | undefined;
}

export default function PasswordValidationDisplay({ password, confirm }: Props) {
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