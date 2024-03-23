import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  onConfirm?: (e: any) => void;
  onCancel?: (e: any) => void;
  message?: string;
  triggerText?: string;
}

export default function AreYouSure({ onConfirm, onCancel, triggerText = "cancel", message = "This action cannot be undone, are you sure you want to continue?" }: Props) {
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button">
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}