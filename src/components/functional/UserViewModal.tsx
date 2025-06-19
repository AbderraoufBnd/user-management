import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/Types";

interface UserViewModalProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

export default function UserViewModal({ open, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Full information about the selected user.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold">First Name:</span> {user.firstname}
          </div>
          <div>
            <span className="font-semibold">Last Name:</span> {user.lastname}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {user.role}
          </div>
          {user.comment && (
            <div>
              <span className="font-semibold">Comment:</span> {user.comment}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
