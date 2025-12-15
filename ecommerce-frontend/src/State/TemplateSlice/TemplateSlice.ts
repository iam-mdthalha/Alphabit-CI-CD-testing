import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { Templates } from "Enums/Templates"

interface TemplateState {
  selected: Templates
}

const initialState: TemplateState = {
  // selected: Templates.TEMP2,
  // selected: Templates.TEMP3,
  selected: Templates.TEMP4,
}

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplate: (state, action: PayloadAction<Templates>) => {
      state.selected = action.payload
    },
  },
})

export const { setTemplate } = templateSlice.actions
export default templateSlice.reducer

