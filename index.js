import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Db_connect from './DB_Connect/Db_connect.js';
import userRoute from './Route/UserRoute.js';
import TaskRoute from "./Route/TaskRoute.js";
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();


app.use(cors({
    origin: process.env.CLIENT_URL || 'https://task-management-snowy-seven.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
}));

app.use(express.json());


Db_connect();

app.use('/api/v1', userRoute);
app.use('/api/v1', TaskRoute);


app.listen(PORT, () => {``
    console.log(`Server running on port ${PORT}`);
});
