const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/mydb")
const db = mongoose.connection;

const duduSchema = new Schema({
    value: String
})

//console.log(duduSchema)

const Dudu = mongoose.model('Dudu', duduSchema);

const bobi = new Dudu({ value: 'hello'})

db.on('error', err => console.log('connection error') );
db.once('open', () => {
    console.log('connected successfully');
});