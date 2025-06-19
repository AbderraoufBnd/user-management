import { User, UsersGetResponse } from "@/types/Types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { users } from "@/data/mockUsersData";
import { delay } from "@/lib/utils";
import { RootState } from "@/app/rootReducer";
import { toast } from "@/hooks/use-toast";

type UsersState = {
  users: UsersGetResponse;
  filteredUsers: User[];
  loading: boolean;
  terminated: boolean;
  loadingAction: boolean;
};

const initialState: UsersState = {
  users: { users: [] },
  filteredUsers: [],
  loading: true,
  terminated: false,
  loadingAction: false,
};

type RejectError = { message: string };

export const getUsers = createAsyncThunk<UsersGetResponse, void, { rejectValue: RejectError }>("users/fetchUsers", async (_, { rejectWithValue, getState }) => {
  const state = getState() as RootState;
  const usersState = state.users;
  const storedUsers = usersState?.users?.users;

  try {
    await delay(1000);
    if (storedUsers?.length === 0) {
      const response: UsersGetResponse = { users: users };
      return response;
    } else {
      return usersState?.users;
    }
  } catch (error) {
    return rejectWithValue({ message: "Error fetching users" });
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    UpdateUser: (state, action: PayloadAction<User>) => {
      const updated = action.payload;
      console.log(updated);

      const filteredUser = state.users?.users?.find((user) => user?.email === updated?.email && user.id !== updated.id);
      if (filteredUser) {
        toast({
          variant: "destructive",
          title: "Error updating user",
          description: `User with same email already exists`,
          duration: 3000,
        });
      } else {
        state.users.users = state.users.users.map((u) => (u.id === updated.id ? updated : u));
        state.filteredUsers = state.users.users;
        toast({
          title: "User Updated",
          description: `${updated.firstname} ${updated.lastname} has been updated successfully.`,
          duration: 3000,
        });
      }
    },
    createUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      const filteredUser = state.users?.users?.find((user) => user?.email === newUser?.email);
      if (filteredUser) {
        toast({
          variant: "destructive",
          title: "Error creating user",
          description: `User with same email already exists`,
          duration: 3000,
        });
      } else {
        state.users.users.unshift(newUser);
        state.filteredUsers = state.users.users;
        toast({
          title: "User Created",
          description: `${newUser.firstname} ${newUser.lastname} has been added successfully.`,
          duration: 3000,
        });
      }
    },
    filterUsersByName: (state, action: PayloadAction<string>) => {
      const search = action.payload.toLowerCase();
      state.filteredUsers = state.users.users.filter((user) => `${user.firstname} ${user.lastname}`.toLowerCase().includes(search));
    },
    filterUsersByRole: (state, action: PayloadAction<User["role"] | "all">) => {
      const role = action.payload;
      if (role === "all") {
        state.filteredUsers = state.users.users;
      } else {
        state.filteredUsers = state.users.users.filter((user) => user.role === role);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.terminated = false;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<UsersGetResponse>) => {
        state.users = action.payload;
        state.filteredUsers = action.payload.users;
        state.loading = false;
        state.terminated = true;
      })
      .addCase(getUsers.rejected, (state) => {
        state.loading = false;
        state.terminated = true;
      });
  },
});

export const { UpdateUser, createUser, filterUsersByName, filterUsersByRole } = usersSlice.actions;

export default usersSlice.reducer;
