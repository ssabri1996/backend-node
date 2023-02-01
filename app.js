const express = require("express");
const bodyParser = require('body-parser');
const morgan = require('morgan')
require('dotenv/config');
const passport = require("passport");
const cookieParser = require("cookie-parser");
const connectDB = require('./database/connection')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
// custom entrypoint
const app = express();

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

const PORT = process.env.PORT || 8080
// configure middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser()); // parse form data client

//log requests
app.use(morgan('tiny'))


//mongodb connection
connectDB();

// passport middleware init
app.use(passport.initialize());




//set view engine
app.set('view engine', 'ejs')

//Import Routes
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservation');
const roomRoutes = require('./routes/room');
const platRoutes = require('./routes/plat');
const menuRoutes = require('./routes/menu');
const userRoutes = require('./routes/user');
const depotRoutes = require('./routes/depot')
const categoryRouters = require('./routes/category');
const familyRouters = require('./routes/family');
const articleRouters = require('./routes/article');
const typeRouters = require('./routes/type');
const courseRouters = require('./routes/course');
const inventaireRouters = require('./routes/inventaire');
const sectionsRouters = require('./routes/sections');
const suitsRouters = require('./routes/suits');

// use routes
app.use('/auth', authRoutes);
app.use('', reservationRoutes);
app.use('/admin/me', roomRoutes);
app.use('', platRoutes);
app.use('', menuRoutes);
app.use('', userRoutes);
app.use('/admin/me', depotRoutes);
app.use('/admin/me', categoryRouters);
app.use('/admin/me', familyRouters);
app.use('/admin/me', articleRouters);
app.use('/admin/me', typeRouters);
app.use('/admin/me', courseRouters);
app.use('/admin/me', inventaireRouters);
app.use('/admin/me', sectionsRouters);
app.use('/admin/me', suitsRouters);
app.use('/uploads', express.static('uploads'));

// echo msg for startup
app.get('/admin/me', (req, res) => {
    res.send('Node server running!')
});
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) })
