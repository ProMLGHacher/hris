import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { $api } from '../../shared/api'
import { isAxiosError } from 'axios'

type AuthState = {
    loading: boolean,
    token: string | undefined,
    role: "ADMIN" | "USER" | undefined,
    login: string | undefined,
    error: undefined | string,
    avatar: string | undefined
}

const initialState: AuthState = {
    loading: false,
    token: localStorage.getItem('token') || undefined,
    role: localStorage.getItem("role") == "ADMIN" ? "ADMIN" : "USER" || undefined,
    login: localStorage.getItem("login") || undefined,
    avatar: localStorage.getItem("avatar") || undefined,
    error: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            state.error = undefined
            state.loading = false
            state.login = undefined
            state.role = undefined
            state.token = undefined

            localStorage.removeItem("token")
            localStorage.removeItem("role")
            localStorage.removeItem("login")
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.pending, (state) => {
            state.loading = true
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            const payload = action.payload
            state.token = payload.token
            state.login = payload.user.login
            state.role = payload.user.role == "ADMIN" ? "ADMIN" : "USER"

            localStorage.setItem("token", payload.token)
            localStorage.setItem("login", payload.user.login)
            localStorage.setItem("role", payload.user.role)

            state.error = undefined
            state.loading = false
        })
        builder.addCase(loginThunk.rejected, (state, payload) => {
            console.log(payload);

            state.error = payload.payload
            state.loading = false
        })
        builder.addCase(uploadAvatarThunk.fulfilled, (state, action) => {
            state.avatar = action.payload
            localStorage.setItem("avatar", action.payload)
            state.loading = false
        })
    }
})

type LoginFullfiled = {
    "token": string,
    "user": {
        "id": number,
        "login": string,
        "role": string
    }
}

type LoginPayload = {
    username: string;
    password: string;
}

export const loginThunk = createAsyncThunk<LoginFullfiled, LoginPayload, { rejectValue: string }>("logThunk", async (data, { rejectWithValue }) => {
    try {
        const result = await $api.post('/auth', data)
        if (result.status === 400) {
            return rejectWithValue("Аккаунт не найден")
        }
        return result.data
    } catch (error) {
        if (isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message)
        }
        return rejectWithValue("чтото не так")
    }
})

export const uploadAvatarThunk = createAsyncThunk<string, File, { rejectValue: string }>("uploadAvatarThunk", async (data, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('avatar', data);
        await $api.put('/profile', formData)
        return data.name
    } catch (error) {
        if (isAxiosError(error)) {
            return rejectWithValue(error.response?.data)
        }
        return rejectWithValue("чтото не так")
    }
})

// Action creators are generated for each case reducer function
export const { logOut } = authSlice.actions

export default authSlice.reducer