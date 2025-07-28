const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Trade',
  tableName: 'trades',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    symbol: {
      type: 'varchar',
    },
    quantity: {
      type: 'int',
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    type: {
      type: 'varchar', // 'buy' or 'sell'
    },
    timestamp: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      eager: true,
    },
  },
});
