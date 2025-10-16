import { useState } from 'react'
import LeadCaptureDialog from '../LeadCaptureDialog'
import { Button } from '@/components/ui/button'

export default function LeadCaptureDialogExample() {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <LeadCaptureDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
