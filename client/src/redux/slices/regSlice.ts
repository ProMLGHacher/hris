import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { $api } from '../../shared/api'
import { isAxiosError } from 'axios'

type RegStateType = {
    loading: boolean,
    message: undefined | string,
    error: undefined | string
}

const initialState: RegStateType = {
    loading: false,
    message: undefined,
    error: undefined
}

export const regSlice = createSlice({
    name: 'reg',
    initialState,
    reducers: {
        reset: (state, action) => {
            state.message = undefined
            state.error = undefined
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder.addCase(regThunk.pending, (state, _) => {
            state.loading = true
        })
        builder.addCase(regThunk.fulfilled, (state, action) => {
            const payload = action.payload

            state.message = payload
            state.loading = false
        })
        builder.addCase(regThunk.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    }
})

type RegisterPayload = {
    username: string;
    password: string;
}

export const regThunk = createAsyncThunk<string, RegisterPayload, { rejectValue: string }>("regThunk", async (data, { rejectWithValue }) => {
    try {
        const result = await $api.post('/reg', data)
        return result.data.message
    } catch (error) {
        if (!isAxiosError(error)) {
            return rejectWithValue("Чтото пошло не так")
        }
        if (error.response?.status == 409) {
            console.log('sdilfuhsduiolfyhsduilfhuil');
            
            return rejectWithValue(error.response?.data.message)
        }
        else {
            return rejectWithValue("Чтото пошло не так")
        }
    }
})

// Action creators are generated for each case reducer function
export const { reset } = regSlice.actions

export default regSlice.reducer