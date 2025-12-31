import { configureStore } from '@reduxjs/toolkit'
import TodoReducer from "./features/fileSlice"

export const store = configureStore({
    reducer: TodoReducer
})