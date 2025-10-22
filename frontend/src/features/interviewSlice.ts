import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Interview } from '../interfaces/types';

interface InterviewState {
  interviews: Interview[];
  currentInterview: Interview | null;
  loading: boolean;
}

const initialState: InterviewState = {
  interviews: [],
  currentInterview: null,
  loading: false,
};

export const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    addInterview: (state, action: PayloadAction<Interview>) => {
      state.interviews.push(action.payload);
      state.currentInterview = action.payload;
    },
    updateCurrentInterview: (state, action: PayloadAction<Interview>) => {
      state.currentInterview = action.payload;
      // Also update in the interviews array if it exists
      const index = state.interviews.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.interviews[index] = action.payload;
      }
    },
    clearCurrentInterview: (state) => {
      state.currentInterview = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addInterview, updateCurrentInterview, clearCurrentInterview, setLoading } = interviewSlice.actions;
export default interviewSlice.reducer;