import mongoose from 'mongoose';
import app from "./index";
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8000;
/* Connecting to the database and then starting the server. */
mongoose
    .connect(process.env.CONNECTION_STRING as string)
    .then(() => console.log("Database connected"))
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    })
    .catch((err) => {
        console.log(err);
    });


