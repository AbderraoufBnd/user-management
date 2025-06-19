import UsersTable from "@/components/functional/UsersTable";

const UserManagementPage = () => {
  return (
    <div className="mx-auto container h-screen w-4xl p-6 flex flex-col gap-6 bg-background overflow-hidden">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm">View, create, and manage all users in the system.</p>
      </header>

      <div className="flex-1 overflow-auto">
        <UsersTable />
      </div>
    </div>
  );
};

export default UserManagementPage;
