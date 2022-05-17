const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/DatabaseConnection')

dotenv.config({ path: 'config/config.env' });

connectDatabase();

app.get("/ctse/test", (req, res) => {

    res.send("Hello !!");

});

app.listen(process.env.PORT, () => {
    console.log(`Server Started at PORT ${process.env.PORT}`);
})