import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import eventService from "./eventService";

const initialState = {
  events: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Create an event

export const createEvent = createAsyncThunk(
  "event/create",
  async (eventData, thunkAPI ) => {
    try {
     return await eventService.createEvent(eventData);
    } catch (error) {
        const message =(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
  }
);

// Get all events

export const getAllEvents = createAsyncThunk("event/getAll", async (_,thunkAPI) => {
  try {
    return await eventService.getAllEvents();
  } catch (error) {
    const message =(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message)
  }
});

// Delete an event

export const deleteEvent = createAsyncThunk("event/delete", async (id,thunkAPI) => {
  try {
   return await eventService.deleteEvent(id);
  } catch (error) {
    const message =(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message)
  }
});

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = "Event created successfully"
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllEvents.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = action.payload
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = "Event deleted successfully";
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        )
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      });
  },
});

export const { reset } = eventSlice.actions;
export default eventSlice.reducer;