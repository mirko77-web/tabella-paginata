const API_URL = "https://jsonplaceholder.typicode.com/posts";

const $tableData = document.querySelector("#table-data");
const $prevBtn = document.querySelector("#prev");
const $pageSpan = document.querySelector("#page");
const $nextBtn = document.querySelector("#next");
const $limitSelect = document.querySelector("#limit");
 

const state = {
    data: null, // Copia di rendering
    cache: null, // Copia di cache
    pagination: {
        page: 1, // Pagina corrente
        limit: 10, // MAX Elementi per pagina
        totalPages: 1, // Totale delle pagine in base al limit e al numero di elementi
        hasPrevPage: false, // Ci sono pagine precedenti?
        hasNextPage: false, // Ci sono èagine successive?
    },
}

const fetchData = async () => {
    try {
        const response = await fetch(API_URL);
        
        if (response.ok) {
            state.cache = await response.json();
        } else {
            throw new Error("Internal Server Error");
        }
    } catch (error) {
        console.log(error);
    }
}

const paginateData = () => {
    const startIndex = state.pagination.limit * (state.pagination.page - 1);
    state.pagination.totalPages = Math.ceil(state.cache.length / state.pagination.limit); // 101 / 10 -> 11
    state.data = [...state.cache].splice(startIndex, state.pagination.limit);
    state.pagination.hasPrevPage = state.pagination.page > 1;
    state.pagination.hasNextPage = state.pagination.page < state.pagination.totalPages;
}

const renderPagination = () => {
    $pageSpan.innerHTML = `${state.pagination.page} / ${state.pagination.totalPages}`;

    if (state.pagination.hasPrevPage) {
        $prevBtn.removeAttribute("disabled");
    } else {
        $prevBtn.setAttribute("disabled", true);
    }

    if (state.pagination.hasNextPage) {
        $nextBtn.removeAttribute("disabled");
    } else {
        $nextBtn.setAttribute("disabled", true);
    }
}

const render = () => {
    const HTML = state.data.map((item) => {
        return `
        <tr>
            <td>${item.id}</td>
            <td>${item.userId}</td>
            <td>${item.title}</td>
            <td>${item.body}</td>
        </tr>
        `;
    }).join("");

    $tableData.innerHTML = HTML;
    renderPagination();
}

const manageListeners = () => {
    $prevBtn.addEventListener("click", () => {
        state.pagination.page -= 1;
        paginateData();
        render();
    });
    
    $nextBtn.addEventListener("click", () => {
        state.pagination.page += 1;
        paginateData();
        render();
    });

    $limitSelect.addEventListener("change", (event) => {
        state.pagination.limit = event.target.value !== "*" ? Number(event.target.value) : state.cache.length;
        state.pagination.page = 1;
        paginateData();
        render();
    });
    }

const mount = async () => {
    await fetchData();
    paginateData();
    render();
    manageListeners();
}

const init = async () => {
    mount();
}

init();