const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`SELECT chefs.* FROM chefs ORDER BY name`, function(err, results){
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url
        ]
        db.query(query, values, function(err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`SELECT chefs.*
            FROM chefs
            WHERE id = $1`, [id], function(err, results) {
                if (err) throw `Database error! ${err}`

                callback(results.rows[0])
            })
    },
    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name=($1),
                avatar_url=($2)
            WHERE id = $3
            `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) `Database error! ${err}`

            callback()
        })        
    },
    delete(id, callback) {
        db.query(`
            DELETE FROM chefs 
            WHERE id = $1`, [id], function(err, results) {
            if(err) `Database error! ${err}`

            callback()
        })
    }
}