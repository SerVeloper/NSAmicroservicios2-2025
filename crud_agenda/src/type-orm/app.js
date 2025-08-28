const express = require('express');
const { connectDB } = require('./config/db');
const agendaRoutes = require('./routes/api/agenda');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.get('/', (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/api/agenda');
        const agendas = response.data;
        res.render('index', { agendas });
    } catch (error) {
        console.error('Error fetching agendas:', error);
        res.status(500).send('Internal Server Error');
    }});