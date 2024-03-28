import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import regSlice from './slices/regSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    register: regSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch