const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const partyRoutes = require("./routes/partyRoutes");
const entryRoutes = require("./routes/entryRoutes");
const lotRoutes = require("./routes/lotRoutes");
const dispatchRoutes = require("./routes/dispatchRoutes");
const entryOutRoutes = require("./routes/entryOutRoutes");

require("dotenv").config();

const app = express();

// Connect to database
connectDB();

// Middleware setup
app.use(cookieParser());
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://singhania-gamma.vercel.app",
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Deny the request
    }
  },
  credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/party", partyRoutes);
app.use("/api", entryRoutes);
app.use("/api", lotRoutes);
app.use("/api", dispatchRoutes);
app.use("/api", entryOutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
