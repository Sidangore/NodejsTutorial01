const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://angoresid:angoresid@cluster0.wtgd9.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true })
        .then(
            client => {
                console.log('Connected to DB!');
                _db = client.db();
                callback(client);
            }
        ).catch(err => {
            console.log(err);
            throw (err);
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No DB found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;