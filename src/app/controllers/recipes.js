const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Recipe_Files = require('../models/Recipe_Files')


module.exports = {
    async index(req, res) {
        
        const { filter } = req.query

        const results = await Recipe.all(filter)
        const recipes = results.rows

        return res.render("recipes/index", { recipes, filter })
    },
    async show(req, res) {

        // get recipe
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        recipe.ingredients = recipe.ingredients.filter(ingredient => ingredient != "")
        recipe.preparation = recipe.preparation.filter(eachprep => eachprep != "")

        // get images
        results = await File.findFiles(recipe.id)
        const recipe_files = results.rows

        const filesPromise = recipe_files.map(file => File.takeFiles(file.file_id))
        const filesResults = await Promise.all(filesPromise)

        let files = filesResults.map(file => file.rows[0])

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("recipes/show", { recipe, files })
    },
    async create(req, res) {   
        const results = await Recipe.chefsSelectedOptions()
        const chefsOptions = results.rows

        return res.render("recipes/create", { chefsOptions })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
    
        for(let key of keys) {
            if(req.body[key] == "") return res.send("Please, fill all fields")
        }

        if (req.files.length == 0) return res.send("Please, send at least one image")

        // create recipe
        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        // create images
        const filesPromise = req.files.map(file => File.create({...file}))
        const filesResults = await Promise.all(filesPromise)

        const recipeFilesPromise = filesResults.map(file => {
            const fileId = file.rows[0].id

            Recipe_Files.create(recipeId, fileId)
        })

        await Promise.all(recipeFilesPromise)
            
        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async edit(req, res) {

        // get recipes
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")

        // get chefs
        results = await Recipe.chefsSelectedOptions()
        const chefsOptions = results.rows

        // get images 
        results = await File.findFiles(recipe.id)
        const recipe_files = results.rows // ex: 1 linha => { id: 15, recipe_id: 24, file_id: 53 } (console.log(recipe_files[0]))
        
        const filesPromise = recipe_files.map(file => File.takeFiles(file.file_id))
        let filesResults = await Promise.all(filesPromise)
        
        filesResults = filesResults.map(file => file.rows[0])

        files = filesResults.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("recipes/edit", { recipe, chefsOptions, files })
    },
    async put(req, res) {

        const keys = Object.keys(req.body)

        for(let key of keys) {
            if(req.body[key] == "" && key != "removed_files") {
                return res.send("Please, fill all fields")
            }
        }
                
        // create new images
        if(req.files.length != 0) {
            //criamos aqui um array de promessas de criação de arquivos na tabela files
            const newfilesPromise = req.files.map(file => File.create({...file}))
            const newfilesResults = await Promise.all(newfilesPromise)
            
            
            const recipeFilesPromise = newfilesResults.map(file => {
                // aqui obtemos o id de cada arquivo
                const fileId = file.rows[0].id
                // utilizamos o id de cada arquivo para criarmos um relacionamento
                // entre a tabela files e recipes usando a tabela recipe_files
                Recipe_Files.create(req.body.id, fileId)
            })
            // aqui cumprimos as promessas finalizando a junção entre as tabelas
            await Promise.all(recipeFilesPromise)
        }
        
        // deleting oldPhotos
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
            
            const removedFilesPromise = removedFiles.map(id => {
                File.delete(id)
                Recipe_Files.file_deleted(id)
            })
            
            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body)
        
        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        await Recipe.delete(req.body.id)
        
        return res.redirect(`/admin/recipes/${req.body.id}`)
    }
}