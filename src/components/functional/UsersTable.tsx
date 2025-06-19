import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { User } from "@/types/Types";
import { ViewIcon, PencilIcon } from "lucide-react";
import { RootState } from "@/app/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { useEffect, useState } from "react";
import { createUser, getUsers, UpdateUser, filterUsersByName, filterUsersByRole } from "@/features/users/usersSlice";
import Spinner from "../ui/Spinner";
import UserFormModal from "./UserFormModal";
import UserViewModal from "./UserViewModal";
import { useToast } from "@/hooks/use-toast";

const UsersTable = () => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "firstname",
      header: "First Name",
    },
    {
      accessorKey: "lastname",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleOpenViewUser(user)}>
              <ViewIcon className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
              <PencilIcon className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const { users, filteredUsers, loading, terminated } = useSelector((state: RootState) => state.users);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [viewUser, setViewUser] = useState<User | undefined>(undefined);
  const { toast } = useToast();
  const handleCreate = () => {
    setEditingUser(undefined);
    setModalOpen(true);
  };

  const handleSubmitCreate = (formData: User) => {
    const id = (users?.users?.length + 1)?.toString();
    const newUser: User = {
      ...formData,
      id,
    };
    dispatch(createUser(newUser));
  };

  const handleSubmitUpdate = (formData: User) => {
    if (editingUser) {
      const user = { ...formData, id: editingUser?.id };
      dispatch(UpdateUser(user));
    } else {
      toast({
        variant: "destructive",
        description: "Error updating user",
      });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(undefined);
  };

  const handleCloseViewUser = () => {
    setViewModalOpen(false);
    setViewUser(undefined);
  };

  const handleOpenViewUser = (user: User) => {
    setViewUser(user);
    setViewModalOpen(true);
  };

  return (
    <>
      {loading && !terminated ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex justify-between flex-wrap gap-4 mb-4">
            <Button onClick={handleCreate}>Create User</Button>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input type="text" placeholder="Search by name" onChange={(e) => dispatch(filterUsersByName(e.target.value))} className="border rounded px-3 py-2 text-sm w-full sm:w-64" />

              <select onChange={(e) => dispatch(filterUsersByRole(e.target.value as User["role"] | "all"))} className="border rounded px-3 py-2 text-sm w-full sm:w-40" defaultValue="all">
                <option value="all">All roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <DataTable columns={columns} data={filteredUsers} />
          <UserFormModal open={modalOpen} onClose={handleCloseModal} initialData={editingUser} onSubmit={editingUser ? handleSubmitUpdate : handleSubmitCreate} />
          <UserViewModal open={viewModalOpen} onClose={handleCloseViewUser} user={viewUser} />
        </>
      )}
    </>
  );
};

export default UsersTable;
