// Tratamento do campo de seleção de estados

function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( res => res.json())
        .then( states => {

            for (const state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        })
}

populateUFs()

// Tratamento do campo de seleção de cidades 

function getCity(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")
    
    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<options>Selecione a cidade</options>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => {

        for (const city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
        citySelect.disabled = false
    })
}

// Este document fica ouvindo os events

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCity)

// Proximos bloco de codigo são para a seleção de items reciclaveis, todas as tag <li>
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (let item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target
    //  adicionar ou remover uma classe com javaScript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id
    // console.log('ITEM ID: ', itemId)

    // Verificar se existem itens  selecionados, se sim 
    // ...então pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId
        return itemFound
    })
    
    // Se já estiver selecionado
    if (alreadySelected >= 0) {
        //  então tirar da seleção
        const filteredItems = selectedItems.filter( item => {
            const itemsIsDifferent = item != itemId
            return itemsIsDifferent
        })

        selectedItems =  filteredItems

    } else {
        // Se não estiver selecionado

        // adicionar a seleção
        selectedItems.push(itemId)
    }
    
    // console.log('SSELECTED ITEMS: ', selectedItems)

    // Atualizar o campo selecionado com os itens selecionados 
    collectedItems.value = selectedItems
}



