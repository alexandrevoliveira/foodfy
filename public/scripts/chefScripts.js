const ChefPhoto = {
    input: "",
    uploadLimit: 1,
    preview: document.querySelector('#photo-preview'),
    files: [],
    upload(event) {
        const { files: fileList } = event.target
        ChefPhoto.input = event.target

        if(ChefPhoto.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            ChefPhoto.files.push(file)

            const reader = new FileReader()
            
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = ChefPhoto.createContainer(image)

                ChefPhoto.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        ChefPhoto.input.files = ChefPhoto.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = ChefPhoto
        const { files: fileList } = input

        if(fileList.length > uploadLimit) {
            alert(`Coloque apenas ${uploadLimit} foto`)
            event.preventDefault()
            return true
        }

        const photoDiv = []
        preview.childNodes.forEach(div => {
            if(div.classList && div.classList.value == "chef-photo") {
                photoDiv.push(div)
            }
        })

        const totalPhoto = photoDiv.length + fileList.length

        if(totalPhoto > uploadLimit) {
            alert(`Limite de ${uploadLimit} foto(s) atingido`)
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        ChefPhoto.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    createContainer(image) {
        const div = document.createElement('div')
        div.classList.add('chef-photo')

        div.onclick = ChefPhoto.removePhoto

        div.appendChild(image)

        div.appendChild(ChefPhoto.createRemoveButton())

        return div
    },
    createRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "delete"

        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(ChefPhoto.preview.children)
        const index = photosArray.indexOf(photoDiv)

        ChefPhoto.files.splice(index, 1)
        ChefPhoto.input.files = ChefPhoto.getAllFiles()

        photoDiv.remove()
    }
}