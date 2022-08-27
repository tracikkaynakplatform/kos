import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    kubeconfig: null
};

const slice = createSlice({
    name: "kubeconfig",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        loadFromDefaultSuccess(state, action) {
            state.isLoading = false;
            state.config = action.payload;
        },
    },
});

export default slice.reducer;

/**
 * React datayı direk buradan çeker
 * Bu alanda axios kullanarak GET, POST vs gibi api çağrısı yapılırsa
 * react backend üzerinde de çalışır.
 */

export function loadFromDefault() {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = await window.kubeConfig.loadFromDefault();
            dispatch(slice.actions.loadFromDefaultSuccess(data));
        } catch (error) {
            throw new Error(error);
        }
    };
}
