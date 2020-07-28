const db = require('../../config/db')

module.exports = {
    all(filter) {

        let query = `            
            SELECT recipes.*, chefs.name AS chef
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id is NOT NULL
            `


        if(filter) {
            query = `
                ${query}
                AND recipes.title ILIKE '%${filter}%'
            `
        }
            
        query = `            
            ${query}
            ORDER BY recipes.title ASC`

        return db.query(query)
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                title,
                chef_id,
                ingredients,
                preparation,
                information
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `

        const values = [
            data.title,
            data.chef_id,
            data.ingredients,
            data.preparation,
            data.information
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])
    },
    update(data) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
            WHERE id = $6
            `

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)        
    },
    delete(id) {
        return db.query(`
            DELETE FROM recipes 
            WHERE id = $1`, [id])
    },
    chefsSelectedOptions() {
        return db.query(`SELECT * FROM chefs`)
    }
}