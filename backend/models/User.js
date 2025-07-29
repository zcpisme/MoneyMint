const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    user_id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    username: {
      type: 'varchar',
    },
    password_hash: {
      type: 'varchar',
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    balance: {
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 100000,
    },
  },
});
