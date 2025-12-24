require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { initAdmin } = require('./controllers/adminControllers');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const imageRoutes = require('./routes/imageRoutes');
const departmentsRoutes = require('./routes/departmentsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const indexRoutes = require('./routes/frontendRoutes/indexRoutes.js');
const dashboardRoutes = require('./routes/frontendRoutes/dashboardRoutes.js');
const path = require('path');
const cors = require('cors');
require('./connection.js');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT || 4000; // Default fallback

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow allorigins unless specified
app.use(cors());


// Session for user authentication and access
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,  // ✅ Refresh cookie TTL on every request
    cookie: { 
      maxAge: 5 * 60 * 60 * 1000  // ✅ 5 hours in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 5 * 60 * 60,  // ✅ 5 hours in seconds
      autoRemove: 'native'
    })
  })
);


// Serve uploaded images and static files
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Frontend Client Routes
app.use('/dashboard', dashboardRoutes);
app.use('/', indexRoutes);

// Backend Server Routes
app.use('/admin', adminRoutes);
app.use('/appointments', bookingRoutes);
app.use('/contact', contactRoutes);
app.use('/images', imageRoutes);
app.use('/departments', departmentsRoutes);
app.use('/blog', blogRoutes);
app.use('/services', servicesRoutes);

// Initialize and start server
app.listen(port, async () => {
  await initAdmin();
  console.log(`Server running on http://localhost:${port}`);
});
