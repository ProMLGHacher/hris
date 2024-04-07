import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { $api } from '../../shared/api'
import { isAxiosError } from 'axios'

type AuthState = {
    loading: boolean,
    token: string | undefined,
    role: "ADMIN" | "USER" | undefined,
    login: string | undefined,
    error: undefined | string,
    avatar: string | undefined,
    name : string | undefined,
    lastname : string | undefined,
    email : string | undefined
}

const initialState: AuthState = {
    loading: false,
    token: localStorage.getItem('token') || undefined,
    role: localStorage.getItem("role") == "ADMIN" ? "ADMIN" : "USER" || undefined,
    login: localStorage.getItem("login") || undefined,
    avatar: localStorage.getItem("avatar") || undefined,
    name: localStorage.getItem("name") || undefined,
    lastname : localStorage.getItem("lastname") || undefined,
    email : localStorage.getItem("email") || undefined,
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
            state.avatar = undefined
            state.email = undefined
            state.name = undefined
            state.lastname = undefined

            localStorage.removeItem("token")
            localStorage.removeItem("role")
            localStorage.removeItem("login")
            localStorage.removeItem("avatar")
            localStorage.removeItem("name")
            localStorage.removeItem("lastname")
            localStorage.removeItem("email")
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
            state.avatar = payload.user.avatar
            state.name = payload.user.name
            state.lastname = payload.user.lastname
            state.email = payload.user.email

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
        })
        builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
            if (action.payload.name) {
                state.name = action.payload.name
                localStorage.setItem("name", action.payload.name)
            }
            if (action.payload.lastname) {
                state.lastname = action.payload.lastname
                localStorage.setItem("lastname", action.payload.lastname)
            }
            if (action.payload.email) {
                state.email = action.payload.email
                localStorage.setItem("email", action.payload.email)
            }
        })
    }
})

type LoginFullfiled = {
    "token": string,
    "user": {
        "id": number,
        "login": string,
        "role": string,
        lastname: string,
        name: string,
        email: string,
        avatar : string
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

type UserData = {
    name?: string | undefined,
    lastname?: string | undefined,
    email?: string | undefined
}

export const updateProfileThunk = createAsyncThunk<UserData, UserData, { rejectValue: string }>("updateProfileThunk", async (data, { rejectWithValue }) => {
    try {
        const res = await $api.patch('/profile', data)
        return data
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