// src/slices/todoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

// Async thunk to fetch todos
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/todos');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Async thunk to add a todo
export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/todos', todoData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Async thunk to update a todo
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/todos/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Async thunk to delete a todo
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/todos/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// You can create more thunks for update and delete operations

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for addTodo, updateTodo, deleteTodo
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      // Delete todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
