const db = require('../../config/db')

module.exports = {
    async findOne(filters) {
        let query = "SELECT * FROM chefs"

        Object.keys(filters).map(key => {
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = ${filters[key][field]}`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },
    all() {
        return db.query(`
            SELECT chefs.*, count(recipes) AS recipes_amount
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY name`)
    },
    create(data, file_id) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.name,
            file_id
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT chefs.*, count(recipes) AS recipes_amount
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])
    },
    async update(id, fields) {
        try {
            let query = "UPDATE chefs SET" 

            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length) {
                    query += ` ${key} = '${fields[key]}',`
                } else {
                    query += ` ${key} = '${fields[key]}' WHERE id = ${id}`
                }
            })

            await db.query(query)        

            return
            
        } catch (err) {
            console.error(err)            
        }
    },
    delete(id) {
        return db.query(`
            DELETE FROM chefs 
            WHERE id = $1`, [id])
    },
    showAllRecipes(id) {
        return db.query(`
            SELECT recipes.*
            FROM recipes
            WHERE recipes.chef_id = $1`, [id])
    }
}