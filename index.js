const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = 8080 || process.env.PORT;
const { PrismaClient } = require('./generated/prisma');
const subscriptionsRouters = require('./routes/subscription')
const joblist =require('./routes/joblist')


const app = express();
const parima = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/uploads' , express.static('uploads'))


//controller
app.use('/api' , subscriptionsRouters)
app.use("/api"  , joblist )


app.get("/", (req, res) => {
  res.send(
    `  <h1>
      Backend is working...
    </h1>`
  );
});

app.listen(PORT, () =>
  console.log(`Server is working http://localhost:${PORT}`)
);
