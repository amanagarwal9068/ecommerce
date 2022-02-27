
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

const PORT = process.env.PORT || 3000;

// Connecting with database
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/products", productRouter);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Starting server on given port
app.listen(PORT, () => console.log(`Server is working on port: ${PORT}`));
