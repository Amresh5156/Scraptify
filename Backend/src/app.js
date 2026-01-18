const express = require("express");
const authRouter = require("./routes/auth.route");
const notesRoutes = require("./routes/notes.route");
const cors = require("cors");


const app = express();


app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use('/api/auth', authRouter)
app.use("/api/notes", notesRoutes);
app.get('/test', (req, res) => res.send('Working!'));



module.exports = app