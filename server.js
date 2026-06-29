const express = require("express");
const cors = require("cors");
require("dotenv").config();

const taskRouter = require("./routes/taskRoutes");
const userRouter = require("./routes/userRoute");
const assignTaskRouter = require("./routes/assignedTaskRoutes");

const path = require("path");
const connectDb = require("./config/db");

const app = express();


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/task", taskRouter);
app.use("/user", userRouter);
app.use("/assign-task", assignTaskRouter);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});