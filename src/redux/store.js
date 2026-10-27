import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import blogSlice from "./features/blogs/blogSlice";
import formSlice from "./features/form/formSlice";

// Create logger middleware
const logger = createLogger();

const store = configureStore({
  reducer: {
    blogs: blogSlice,
    form: formSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(process.env.NODE_ENV === "development" ? logger : []), // Conditionally add logger
});

export default store;
