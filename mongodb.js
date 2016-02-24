var ObjectID = require('bson-objectid');

module.exports = {
  "localhost:27017": {
    "databases": {
      "node-emulator": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "login"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "node-emulator.login",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "login",
            "documents": [
              {
                "userId": "alvarodms",
                "password": "abc123",
                "sex": "M",
                "email": "alvaro.dasmerces@gmail.com",
                "_id": ObjectID("56cd12ff3be85f1bf03b8f65")
              }
            ]
          }
        ]
      }
    }
  }
}