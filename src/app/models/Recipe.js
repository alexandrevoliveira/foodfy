const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id is NOT NULL`, function(err, results){
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                image,
                title,
                chef_id,
                ingredients,
                preparation,
                information
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.image,
            data.title,
            data.chef_id,
            data.ingredients,
            data.preparation,
            data.information
        ]
        db.query(query, values, function(err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id], function(err, results) {
                if (err) throw `Database error! ${err}`

                callback(results.rows[0])
            })
    },
    update(data, callback) {
        const query = `
            UPDATE recipes SET
                image=($1),
                title=($2),
                chef_id=($3),
                ingredients=($4),
                preparation=($5),
                information=($6)
            WHERE id = $7
            `

        const values = [
            data.image,
            data.title,
            data.chef_id,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) `Database error! ${err}`

            callback()
        })

        
    },
    delete(id, callback) {
        db.query(`
            DELETE FROM recipes 
            WHERE id = $1`, [id], function(err, results) {
            if(err) `Database error! ${err}`

            callback()
        })
    },
    chefsSelectedOptions(callback) {
        db.query(`SELECT * FROM chefs`, function(err, results){
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    }
}