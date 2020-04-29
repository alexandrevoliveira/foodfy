const plates = document.querySelectorAll('.plate')

for (let i = 0; i < plates.length; i++) {
    plates[i].addEventListener("click", function() {
        window.location.href = `/recipes/${i}`
    })
}

/*
ALTERNATIVE WAY

for (let plate of plates) {
    plate.addEventListener("click", function(){
        const index = plate.id
        window.location.href = `/recipes/${index}`
    })
}
*/

