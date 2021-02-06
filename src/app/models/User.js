const db = require("../../config/db")
const mailer = require("../lib/mailer")
const crypto = require('crypto')
const { hash } = require('bcryptjs')

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

            await mailer.sendMail({
                to: data.email,
                from: "no-reply@foodfy.com.br",
                subject: "Nova conta",
                html: `
                <h2>Sua nova conta do Foodfy foi criada</h2>
                <p>Sua senha é: ${randomPassword}</p>
                <p>Caso queira trocar sua senha, clique no link abaixo
                    <a href="http://localhost:3000/admin/users/forgot-password">
                        TROCAR A SENHA
                    </a>
                </p>
                `
            })

            // password hash
            const passwordHash = await hash(randomPassword, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
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
    },
    async delete(id) {
        return db.query(`DELETE FROM users WHERE id = ${id}`)
    }
}