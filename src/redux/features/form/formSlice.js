import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  userdata: null,
  error: "",
  loading: false,
};

export const AddUserForm = createAsyncThunk(
  "form/AddUserForm",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://blogs.erstech.org/wp-json/custom/v1/send-mail",
        formData
      );
      if (res.status === 200) {
        toast.success(res.data.message);
      }
      const resData = res.data;
      return {
        data: resData,
        message: "success",
      };
    } catch (error) {
      console.error("Error....", error);
      return rejectWithValue({ message: "Failed to fetch blogs" });
    }
  }
);

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    clearform: (state) => {
      state.form = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for getBlogs ======
    builder.addCase(AddUserForm.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(AddUserForm.fulfilled, (state, action) => {
      state.loading = false;
      state.userdata = action.payload.data;
    });
    builder.addCase(AddUserForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default formSlice.reducer;
export const { clearform } = formSlice.actions;
