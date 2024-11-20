const searcherInput = document.querySelector('#searcher_input')
searcherInput.addEventListener('keyup', filter)

function filter(e) {
    const search = searcherInput.value.toLowerCase()
    document.querySelectorAll(".search_item").forEach(item => {
        if (item.textContent.toLowerCase().includes(search)) {
            item.classList.remove("hidden_search_item")
        } else {
            item.classList.add("hidden_search_item")
        }
    })
}