// lógica de menu ativo

const currentPage = location.pathname
const headerLinks = document.querySelectorAll('header .container .links a')

headerLinks.forEach(link => {
    if(currentPage.includes(link.getAttribute('href'))) {
        link.classList.add('active')
    }
})