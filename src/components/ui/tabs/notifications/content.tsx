import { NotificationsQueryResults } from "@/components/layout/profile-controller"
import NotificationCard from "../../cards/notifications/notification"
import { H4, Small } from "@/components/ui/typography"
import { Separator } from "@radix-ui/react-dropdown-menu"

type Props = { 
  notifications: NotificationsQueryResults[], 
  profile_id: number | null 
}

export function NotificationsTabsContent({ notifications, profile_id }: Props) {
  
  return notifications.length > 0 ? notifications.map((notification) => {
    return (
      <>
        <div className='relative px-5 w-full py-6'>
          <NotificationCard
            profile_id={profile_id}
            data={notification}
          />
        </div>
        <Separator />
      </>
    )
  }) : (
    <div className='py-3 px-5'>
      <H4>Its quiet in here</H4>
      <Small classNames="text-muted-foreground font-medium">There are no new notifications available</Small>
    </div>
  )
}