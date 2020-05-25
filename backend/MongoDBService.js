const util = require('util');
const mongoClient = require('mongodb').MongoClient;

class MongoDBService{
    constructor(url, databaseName){
        this.url = url;
        this.databaseName = databaseName;
    }

    async connect(){
        try{
            const connect = util.promisify(mongoClient.connect);
            this.client = await connect(this.url, {useUnifiedTopology: true});
            this.database = this.client.db(this.databaseName);
        } catch(err){

        }
    }

    disconnect(){
        this.client.close();
    }

    find(collection, parameters = {}){
        return new Promise((resolve,reject)=> {
            this.database.collection(collection).find(parameters).sort({score:1, name:-1}).limit(10).toArray(function(error,data){
                if(error) reject();
                resolve(data);
            })
        });
    }

    findOne(collection,parameters={}){
        return new Promise((resolve,reject)=> {
            this.database.collection(collection).find(parameters).toArray(function(error, data){
                if(error) reject();
                resolve(data);
            })
        });
    }

    insert(collection, parameters) {
        return new Promise((resolve, reject) => {
            this.database.collection(collection).insertOne(parameters, function (error) {
                if (error) reject();
                resolve();
            });
        });
    }

    update(collection, findParams, updateParams){
        return new Promise((resolve,reject) => {
            this.database.collection(collection).update(this.findParams, {$set: updateParams}, function(err){
                if(err) reject();
                resolve();
            })
        });
    }
    delete(collection, findParameters) {
        return new Promise((resolve, reject) => {
            this.database.collection(collection).deleteOne(findParameters, function (error) {
                if (error) reject();
                resolve();
            });
        });
    }
}

module.exports = MongoDBService;
