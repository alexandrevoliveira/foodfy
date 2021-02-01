const db = require("../../config/db")
const crypto = require('crypto')
const { all } = require("../../routes/users")

module.exports = {
    async all() {
        try {
            const query = "SELECT * FROM users"
            const results = await db.query(query)
            return results.rows
        } catch (err) {
            console.error(err)
        }
    },
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
    },
    async update(id, fields) {
        try {
            let query = "UPDATE users SET"

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
    }
}