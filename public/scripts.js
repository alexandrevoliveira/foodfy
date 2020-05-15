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