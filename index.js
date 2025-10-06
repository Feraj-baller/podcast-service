const express = require("express")
const cors = require("cors") // Add this import
const {NotFoundError, ServerError} = require("./middleware/error-handler")
const connectDB = require("./db/connect")
const route = require("./routes/route")

require("dotenv").config()


const app = express()

// ===== CORS CONFIGURATION =====
// Add CORS middleware BEFORE other middleware
app.use(cors({
    origin: 'http://localhost:8080', // Your React frontend URL
    credentials: true,
    optionsSuccessStatus: 200
}))

// If you need to allow multiple origins (e.g., development and production):
// const allowedOrigins = ['http://localhost:8080', 'https://yourdomain.com'];
// app.use(cors({
//     origin: function(origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// port number
app.set("port", process.env.PORT || 5000)


app.use("/api/v1", route)


const start = async ()=>{
    try{
        // connecting to database
        await connectDB(process.env.MONGO_URI)
        // server startup
        app.listen(app.get("port"), ()=>{
            console.log("Listening on port", app.get("port"))
            console.log("CORS enabled for http://localhost:8080")
        })
    } catch (err) {
        console.log({
            message : err
        })

    }
}

start()

// error-handling middleware
app.use(NotFoundError);
app.use(ServerError);