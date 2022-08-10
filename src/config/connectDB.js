


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('booking', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection successfully !');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default connectDB