const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

/*
data
    collection1
        "_model"
        doc1
            "_id"
            key1 : val
            key2 : val
        doc2
        doc3
    collection2
    etc...
*/

// il faut retrouver les documents par leur nom dans les collections... donc pas d'objet anonyme...
// api de collection ?

const seeder = (db, data) => {
    for (let collection in data) {
        const model = data[collection]._model;
        if (model in db.models) {
            for (let doc in data[collection]) {
                if ( doc.split('')[0] !== '_') {
                    console.log('doc : ', doc);
                    let parsedDocument = {};
                    for (let key in data[collection][doc]) {
                        let value;
                        //console.log('key : ', key);
                        if ( key === "_id" ) {
                            value = ObjectId(data[collection][doc][key]);
                        } else if ( data[collection][doc][key].split('->')[0] === '' ) {
                            value = data[collection][doc][key];
                            let collec = value.split('->')[1].split('.')[0];
                            let docu = value.split('->')[1].split('.')[1];
                            value = db.collections[collec].collection[docu];
                        } else {
                            value = data[collection][doc][key];
                        }
                        parsedDocument[key] = value;
                    }
                    console.log(parsedDocument);
                    db.models[model].create(parsedDocument)
                        .then(
                            () => console.log(`inserted ${doc} successfully`),
                            err => console.log(`Error :   ${err.message}` )
                        )
                }
            }
        } else {
            throw new Error( `model ${collection._model} unknown`);
        }
    }
}

// const resolveForeignKeys = doc => {
//     return doc.map( val => {
//         return val.split
//     })
//      return key.split('->')[0] === ''
//         ? db.
//         : key
//         ;
// }

// const resolveId = key => {

// }

module.exports = seeder;