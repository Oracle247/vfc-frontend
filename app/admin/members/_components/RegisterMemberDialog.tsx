"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistrationForm } from "@/components/RegistrationForm";
import type { RegisterPayload } from "@/types/auth";

interface RegisterMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (payload: RegisterPayload) => Promise<void>;
}

export function RegisterMemberDialog({
  open,
  onOpenChange,
  onRegister,
}: RegisterMemberDialogProps) {
  const handleRegister = async (payload: RegisterPayload) => {
    await onRegister(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Member</DialogTitle>
        </DialogHeader>
        <RegistrationForm
          onSubmit={handleRegister}
          submitLabel="Register Member"
          submittingLabel="Registering..."
        />
      </DialogContent>
    </Dialog>
  );
}
