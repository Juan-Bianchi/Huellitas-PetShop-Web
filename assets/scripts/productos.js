const { createApp } = Vue

createApp({
    data() {
        return {
            productos: [],
            producto: undefined,
        }
    },
    created() {

        let urlString = location.search;
        let parameters = new URLSearchParams(urlString);
        let id = parameters.get('id');
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(response => response.json())
            .then(productos => {

                if (window.location.pathname === "/index.html") {
                    this.productos = productos
                } else if (window.location.pathname === "/farmacia.html") {
                    this.productos = productos.filter(producto => producto.categoria === "farmacia")
                } else if (window.location.pathname === "/juguete.html") {
                    this.productos = productos.filter(producto => producto.categoria === "jugueteria")
                }

                this.producto = this.productos.find(prod => prod._id === id);


            })
    },
    methods: {

        abrirPagina() {
            window.open(`./detalles.html?id=${producto._id}`)
        }

    },
}).mount("#app")