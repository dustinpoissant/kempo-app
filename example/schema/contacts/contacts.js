export default {
  email: {
    type: 'text',
    unique: true
  },
  name: {
    type: 'text',
    required: true
  },
  phone: {
    type: 'text'
  },
  address: {
    type: 'text'
  },
  gender: {
    type: 'text'
  },
  birthday: {
    type: 'text'
  }
};

export const version = 2;

export const updates = [
  // v1 → v2: table had email as PK, now uses auto id + email unique
  db => {
    db.exec("DROP TABLE IF EXISTS contacts");
    return true;
  }
];
