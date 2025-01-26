import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface DCMeetingPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (didHappen: boolean, newDate?: Date) => void
  scheduledDate: Date
}

export function DCMeetingPopup({ isOpen, onClose, onConfirm, scheduledDate }: DCMeetingPopupProps) {
  const [didHappen, setDidHappen] = useState<boolean | null>(null)
  const [newDate, setNewDate] = useState<string>("")

  const handleConfirm = () => {
    if (didHappen === null) return
    onConfirm(didHappen, didHappen ? scheduledDate : new Date(newDate))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#1B3668]">DC Meeting Confirmation</DialogTitle>
          <DialogDescription>
            Please confirm if the DC meeting scheduled for {format(scheduledDate, "MMMM d, yyyy")} took place.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={didHappen === true ? "default" : "outline"}
              onClick={() => setDidHappen(true)}
              className="w-full bg-[#1B3668] text-white hover:bg-[#1B3668]/90"
            >
              Yes, it happened
            </Button>
            <Button
              variant={didHappen === false ? "default" : "outline"}
              onClick={() => setDidHappen(false)}
              className="w-full border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668]/10"
            >
              No, it didn't happen
            </Button>
          </div>
          {didHappen === false && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Please select the new date:</p>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full border-[#1B3668] focus:ring-[#1B3668]"
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-[#1B3668] text-[#1B3668] hover:bg-[#1B3668]/10">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={didHappen === null || (didHappen === false && !newDate)}
            className="bg-[#F7941D] text-white hover:bg-[#F7941D]/90"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

