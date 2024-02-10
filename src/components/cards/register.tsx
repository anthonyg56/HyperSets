import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import Title from "../titles/core";
import RegisterForm from "../forms/register";

export default function RegisterCard() {
  return (
    <Card className={cn([
      "p-10 flex flex-col overflow-hidden w-full self-start my-auto items-center max-w-[500px]",
    ])}>
      <Title title="Create An Account" subTitle="Please enter your details" center/>
      <RegisterForm />
    </Card>
  )
}