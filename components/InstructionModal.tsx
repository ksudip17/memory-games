"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InstructionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">How to Play Simon Says</DialogTitle>
        </DialogHeader>
        <div className="text-left space-y-3 pt-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p className="font-semibold text-foreground">🎮 Game Rules:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Watch the instruction carefully</li>
              <li>
                If it says <span className="font-bold text-green-600">"Simon says"</span> - DO the action
              </li>
              <li>If it does NOT say "Simon says" - DO NOT do the action (choose a different one)</li>
              <li>Each correct answer increases your score</li>
              <li>The game speeds up as you progress</li>
            </ul>
          </div>
          <div className="space-y-2 pt-2">
            <p className="font-semibold text-foreground">⌨️ Controls:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Click the buttons OR use keys 1-4</li>
              <li>1 = Jump</li>
              <li>2 = Clap</li>
              <li>3 = Touch Head</li>
              <li>4 = Turn Around</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8"
          >
            Let's Play!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
