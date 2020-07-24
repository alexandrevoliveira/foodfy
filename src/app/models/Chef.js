const db = require('../../config/db')

module.exports = {
    all() {
        return db.query(`
            SELECT chefs.*, count(recipes) AS recipes_amount
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY name`)
    },
    create(data) {
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
    update(data) {
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

        return db.query(query, values)        
    },
    delete(id, callback) {
        return db.query(`
            DELETE FROM chefs 
            WHERE id = $1`, [id])
    },
    showAllRecipes(id, callback) {
        return db.query(`
            SELECT recipes.*
            FROM recipes
            WHERE recipes.chef_id = $1`, [id])
    }
}