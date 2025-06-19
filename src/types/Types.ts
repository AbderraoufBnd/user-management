export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  comment?: string;
};
export type UsersGetResponse = {
  users: User[];
};
