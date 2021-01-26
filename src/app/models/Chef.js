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
    update(data, file_id) {
        const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
            `

        const values = [
            data.name,
            file_id,
            data.id
        ]

        return db.query(query, values)        
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