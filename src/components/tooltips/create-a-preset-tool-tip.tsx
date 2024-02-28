import { ResetIcon } from "@radix-ui/react-icons"
import { Views } from "../forms/CreateAPreset"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

type Props = {
  currentView: Views,
  setView: (view: Views) => void,
  setPreviousView: (view: Views | undefined) => void,
}

export default function CreateAPresetToolTip({ currentView, setView, setPreviousView }: Props) {
  if (currentView === Views.SelectHardware) {
    return null
  }

  const previousView = currentView - 1 <= 0 ? 0 : currentView - 1
  const upcomingView = currentView - 2 <= 0 ? undefined : currentView - 2

  function setViews(e: any) {
    e.preventDefault()

    setView(previousView)
    setPreviousView(upcomingView)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <ResetIcon width={15} height={15} className="absolute top-0 left-0" onClick={(e) => setViews(e)} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Go Back to {Views[previousView].valueOf()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}