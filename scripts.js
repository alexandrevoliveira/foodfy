const modalOverlay = document.querySelector('.modal-overlay')
const plates = document.querySelectorAll('.plate')

for (let plate of plates) {
    plate.addEventListener("click", function(){
        const plateId = plate.getAttribute('id')
        modalOverlay.classList.add('active')
        modalOverlay.querySelector('img').src = `images/${plateId}`
    })
}

document.querySelector('.close-modal').addEventListener("click", function(){
    modalOverlay.classList.remove('active')
})
