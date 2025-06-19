// components/UserFormModal.tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types/Types";
import { useEffect, useState } from "react";
import Spinner from "../ui/Spinner";

// Zod Schema
const userSchema = z.object({
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "editor", "viewer"]),
  comment: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: User) => void;
  initialData?: Partial<User>;
}

export default function UserFormModal({ open, onClose, onSubmit, initialData }: UserFormModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "viewer",
      comment: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstname: initialData.firstname ?? "",
        lastname: initialData.lastname ?? "",
        email: initialData.email ?? "",
        role: initialData.role ?? "viewer",
        comment: initialData.comment ?? "",
      });
    } else {
      reset({
        firstname: "",
        lastname: "",
        email: "",
        role: "viewer",
        comment: "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    setLoading(true);
    setTimeout(() => {
      onSubmit(data as User);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Update User" : "Add User"}</DialogTitle>
          <DialogDescription>{initialData ? "Modify user details" : "Fill the form to add a new user"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="firstname">First Name</Label>
            <Input {...register("firstname")} />
            {errors.firstname && <p className="text-sm text-red-500">{errors.firstname.message}</p>}
          </div>

          <div>
            <Label htmlFor="lastname">Last Name</Label>
            <Input {...register("lastname")} />
            {errors.lastname && <p className="text-sm text-red-500">{errors.lastname.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={undefined} onValueChange={(value) => setValue("role", value as UserFormData["role"])} defaultValue={initialData?.role ?? "viewer"}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea rows={3} {...register("comment")} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full">
              {loading ? <Spinner /> : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
