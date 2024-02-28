export enum NotificationType {
  Comment,
  Like,
  Download,
  Rate,
}

type CommentNotificationProps = {
  commentid: string;
}

function CommentNotification({ commentid }: CommentNotificationProps) {
  // Fetch the comment from the commentid

  return (
    <div>
      <p>Commented on your preset</p>
    </div>
  )
}

type LikeNotificationProps = {
  likeid: string;
}

function LikeNotification() {
  return (
    <div>
      <p>Liked your preset</p>
    </div>
  )
}

type DownloadNotificationProps = {
  downloadid: string;
}

function DownloadNotification() {
  return (
    <div>
      <p>Downloaded your preset</p>
    </div>
  )
}

type RateNotificationProps = {
  rateid: string;
}

function RateNotification() {
  return (
    <div>
      <p>Rated your preset</p>
    </div>
  )
} 