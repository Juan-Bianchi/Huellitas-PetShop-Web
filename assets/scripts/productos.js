const{ createApp } = Vue

createApp({
    data(){
        return{
            jugueteria: [],
            farmacia: []
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(response => response.json())
            .then(productos => {
                this.productos = productos.filter(producto => producto.categoria === "farmacia")
                this.jugueteria = productos.filter(producto => producto.categoria === "jugueteria")
            })
    }
}).mount("#app")