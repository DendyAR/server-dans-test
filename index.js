import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import db from "./config/Database.js";
import router from "./routes/router.js";
import Users from "./models/userModel.js";

dotenv.config();
const app = express();
const port = 8080

try {
    await db.authenticate();
    console.log("Database coneted")
    // await Users.sync();
} catch (error) {
    console.log(error)
}

app.use(cors({ credentials: true, origin:'http://localhost:3001' }))
app.use(cookieParser())
app.use(express.json());
app.use(router);


app.listen(port, () => console.log(`Server running at port ${port}`))