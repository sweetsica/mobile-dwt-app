import {configureStore} from '@reduxjs/toolkit';
import connection from './connection';

const rootReducer = {
  connection: connection,
};

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export default store;
