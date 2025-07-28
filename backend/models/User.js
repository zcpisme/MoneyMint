const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    username: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
    balance: {
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 100000,
    },
  },
  relations: {
    trades: {
      type: 'one-to-many',
      target: 'Trade',
      inverseSide: 'user',
    },
  },
});
