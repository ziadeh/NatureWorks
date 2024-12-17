"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { MouseEventHandler } from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  confirm: MouseEventHandler<HTMLButtonElement>;
};

function AppDialog({ open, setOpen, confirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to submit the form? </DialogTitle>
          <DialogDescription>
            Please review your answers to ensure all information is accurate.
            Once submitted, changes cannot be made.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={confirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AppDialog;
