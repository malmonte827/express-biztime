/** Database setup for BizTime. */

const {CLient} = require('pg')
const Client = require('pg/lib/client')

let DB_URI

if(process.env.NODE_ENV === 'test'){
    DB_URI = "postgresql:///biztime_test"
} else{
    DB_URI = "postgresql:///biztime"
}

const db = new Client({
    connectionString: DB_URI
})

db.connect()

module.exports = db