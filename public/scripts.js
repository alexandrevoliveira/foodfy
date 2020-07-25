//BOTÕES (ESCONDER/MOSTRAR) (/admin/recipes/:id)
const recipeInfo = document.querySelectorAll('.recipe-info')
const botoes = document.querySelectorAll('.visibility')

for (let i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", function() {
        if (recipeInfo[i].classList.contains('hide')) { // retorna true se contem 'hide' no atributo de classe (VALOR BOTAO == 'MOSTRAR')
            recipeInfo[i].classList.remove('hide') // como está escondendo o conteúdo, após o clique irá remover o 'hide'
            botoes[i].innerHTML = "ESCONDER" // após o clique o conteúdo está exposto, logo o conteúdo do botão precisa mudar para 'ESCONDER'
        }
        else {
            recipeInfo[i].classList.add('hide') // nao contém a classe 'hide', logo o conteúdo está exposto e após o clique o conteúdo ficará escondido
            botoes[i].innerHTML = "MOSTRAR" // precisaremos mudar o conteúdo do botão para 'MOSTRAR'
        }
    })
}


function addIngredient() {
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".box-ingredient")

    // realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    //Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}

function addPreparation() {
    const preparations = document.querySelector("#preparation-method")
    const fieldContainer = document.querySelectorAll(".box-preparation")

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    if(newField.children[0].value == "") return false

    newField.children[0].value = ""
    preparations.appendChild(newField)
}

document.querySelector(".add-ingredient").addEventListener("click", addIngredient)
document.querySelector(".add-preparation").addEventListener("click", addPreparation)


const PhotosUpload = {
    input: "",
    uploadLimit: 5,
    preview: document.querySelector('#photos-preview'),
    files: [],
    HandleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)
            
            const reader = new FileReader() // criando um leitor de arquivos e colocando na variável reader

            //onload = só executará após o arquivo está carregado (após a leitura do arquivo)
            reader.onload = () => {

                // após a leitura do arquivo, criaremos um <img> e em seguidas colocaremos o result da imagem no src da <img>
                const image = new Image()
                image.src = String(reader.result) // <img src="reader.result">

                const div = PhotosUpload.getContainer(image)

                // aqui colocamos a <div class="photo"></div> dentro da <div id="photos-preview"></div>
                PhotosUpload.preview.appendChild(div)

            }

            //readAsDataURL = irá ler o arquivo em formato blob
            reader.readAsDataURL(file)
        })

        // o fileList do event.target (event.target.files) recebe o meu fileList do dataTransfer
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {

        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        //checagem inicial do limite de imagens, caso ultrapassado uma mensagem é enviada e previne-se o padrão de saída
        if (fileList.length > uploadLimit) {
            alert(`Escolha até ${uploadLimit} imagens para upload`)
            event.preventDefault()
            return true
        }


        //checagem para caso já hajam fotos adicionadas
        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert(`Limite máximo de ${uploadLimit} imagens para upload foi ultrapassado!`)
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        //aqui faremos nossa própria fileList para podermos remover a imagem do gerenciador de imagens do frontend da aplicação
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        //pegaremos cada file do array de files que criamos e o colocaremos no nosso proprio fileList do dataTransfer
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        // retornaremos aqui nosso fileList
        return dataTransfer.files
    },
    getContainer(image) {

        // criamos aqui uma <div class="photo"></div>
        const div = document.createElement('div')
        div.classList.add('photo')

        // aqui criaremos uma funcionalidade de remover no click
        div.onclick = PhotosUpload.removePhoto

        // aqui colocamos a <img> dentro da <div class="photo"></div>
        div.appendChild(image)

        // aqui colocaremos nosso botao de remover do material icons
        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        // a seguir criarei um ícone de removeção (delete/lixeira)
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'delete'

        return button
    },
    removePhoto(event) {
        // pegaremos a div da imagem a qual queremos 
        // remover, como estamos clicando em cima do ícone do material icons em si, iremos 
        // pegar o seu parentNode que é a <div class="photo"></div>
         const photoDiv = event.target.parentNode

        //  pegaremos aqui a todas as <div class="photo"></div> da <div id="photos-preview"></div>
        const photosArray = Array.from(PhotosUpload.preview.children)

        // pegaremos aqui o índice da imagem passando a photoDiv como argumento
        const index = photosArray.indexOf(photoDiv)

        // remove a photoDiv do array de files criado
        PhotosUpload.files.splice(index, 1)

        // fileList do dataTransfer é retornado agora sem a photoDiv a qual foi removida e passada para o input.files
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()


    }
}