import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    parserId: null,
    document: null,
    diagram: null
}

export const fileSlicer = createSlice({
    name: "file",
    initialState,
    reducers: {
        setParserID : (state, action) => {
            state.parserId = action.payload;
        },
        setDocument: (state, action) => {
            state.document = action.payload
        },
        setDiagram: (state, action) => {
            state.diagram = action.payload
        }
    }
});

export const {setParserID, setDocument, setDiagram} = fileSlicer.actions;

export default fileSlicer.reducer;