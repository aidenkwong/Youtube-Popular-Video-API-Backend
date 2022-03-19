import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import videoRoutes from "./routes/videos.js";
import regionRoutes from "./routes/regions.js";

const app = express();
dotenv.config();
app.use(cors());

app.use(bodyParser.json({ limit: "3000mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "3000mb", extended: true }));

app.get("/", (req, res) => {
  res.send("This is the server of the app");
});

app.use("/videos", videoRoutes);
app.use("/regions", regionRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewURLParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
