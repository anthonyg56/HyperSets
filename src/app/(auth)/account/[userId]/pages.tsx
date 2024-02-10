import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {

  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Presets</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}