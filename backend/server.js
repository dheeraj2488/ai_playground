require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const promptRoute = require('./routes/prompt');
const authRoutes = require('./routes/authRoutes');
const sessionRoute = require('./routes/sessionRoute');
const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=> console.log("MongoDB connected successfully"));

  const corsOptions = {
    origin : process.env.CLIENT_ENDPOINT ,  // 
    credentials : true, //allow cookies to be sent
  }
  app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/prompt', promptRoute);
app.use('/sessions' , sessionRoute);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
