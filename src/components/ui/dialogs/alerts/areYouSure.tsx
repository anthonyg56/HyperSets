
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";

type Props = {
  open?: boolean;
  hidden?: boolean; // hide the trigger button, only show the dialog. Usually open and setOpen will be used to control the dialog
  message?: string;
  triggerText?: string;
  onCancel?: (e: any) => void;
  onConfirm?: (e: any) => void;
  setOpen?: (open: boolean) => void;
}

export default function AreYouSure({ onConfirm, onCancel, open, setOpen, hidden, triggerText = "Cancel", message = "This action cannot be undone, are you sure you want to continue?" }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen} >
      <AlertDialogTrigger asChild className={cn([{
        'hidden': hidden && hidden === true
      }])}>
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