const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'your_mysql_password',
  database: 'stock_app',
  synchronize: true,
  logging: false,
  entities: [
    require('./models/User'),
    require('./models/Trade')
  ],
});

module.exports = { AppDataSource };
