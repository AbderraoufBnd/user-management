import { combineReducers } from "redux";
import usersReducer from "@/features/users/usersSlice";

import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
const userPersistConfig = {
  key: "users",
  storage,
};
const rootReducer = combineReducers({
  users: persistReducer(userPersistConfig, usersReducer),
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
