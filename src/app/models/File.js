const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({filename, path}) {

        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },
    findFiles(recipe_id) {
        return db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`, [recipe_id])
    },
    takeFiles(file_id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [file_id])
    },
    async delete(id) {
        try {

            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        }catch(err) {
            console.error(err)
        }
    }
}