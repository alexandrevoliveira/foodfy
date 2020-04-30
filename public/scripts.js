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



const recipeInfo = document.querySelectorAll('.recipe-info')
const botoes = document.querySelectorAll('.visibility')

for (let i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", function() {
        if (recipeInfo[i].classList.contains('hide')) {
            recipeInfo[i].classList.remove('hide')
            botoes[i].innerHTML = "ESCONDER"
        }
        else {
            recipeInfo[i].classList.add('hide')
            botoes[i].innerHTML = "MOSTRAR"
        }
    })
}