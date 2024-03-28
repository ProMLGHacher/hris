import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { $api } from '../../shared/api'

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

            state.message = payload.message
            state.loading = false
        })
        builder.addCase(regThunk.rejected, (state, _) => {
            state.error = 'somthing went wrong'
            state.loading = false
        })
    }
})

export const regThunk = createAsyncThunk("regThunk", async (data, { rejectWithValue }) => {
    try {
        const result = await $api.post('/reg', data)
        if (result.status === 400) {
            rejectWithValue(result.data)
        }
        return result.data
    } catch (error) {
        return rejectWithValue("Чтото пошло не так")
    }
})

// Action creators are generated for each case reducer function
export const { reset } = regSlice.actions

export default regSlice.reducer