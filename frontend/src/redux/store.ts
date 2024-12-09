import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from "redux-saga";
import taskReducer from "./slices/taskSlice";
import authReducer, { logout } from "./slices/authSlice";
import rootSaga from "./sagas";

// Combine reducers
const appReducer = combineReducers({
  tasks: taskReducer,
  auth: authReducer,
});

// Root reducer with state reset
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === logout.type) {
    state = undefined; // Reset state
  }
  return appReducer(state, action);
};

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
