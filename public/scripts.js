const plates = document.querySelectorAll('.plate')

for (let i = 0; i < plates.length; i++) {
    plates[i].addEventListener("click", function() {
        window.location.href = `/recipes/${i}` //após o clique irá para esta rota associada
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