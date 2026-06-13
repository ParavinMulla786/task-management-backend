const express = require("express");
const cors = require("cors");
require("dotenv").config();

const taskRouter = require("./routes/taskRoutes");
const userRouter = require("./routes/userRoute")
const connectDb  = require('./config/db.js')

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running");
});

// Attach the router here
app.use("/task", taskRouter);
app.use("/user" , userRouter);
const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});