const{ createApp } = Vue

createApp({
    data(){
        return{
            productos: [],
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(response => response.json())
            .then(productos => {
                this.productos = [... productos];
            })
    },
}).mount("#app")