const db = require("../../config/db")
const crypto = require('crypto')

module.exports = {
    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },
    async create(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin
                ) VALUES ($1, $2, $3, $4)
                RETURNING id
            `

            const randomPassword = crypto.randomBytes(6).toString("hex")

            const values = [
                data.name,
                data.email,
                data.password || randomPassword,
                data.is_admin || false
            ]

            const results = await db.query(query, values)

            return results.rows[0].id

        } catch (err) {
            console.error(err)
        }
    }
}