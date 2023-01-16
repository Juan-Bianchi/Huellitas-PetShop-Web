const{ createApp } = Vue

createApp({
    data(){
        return{
            productos: [],
            id : undefined,
            parametroUrl:"",
            parametro : undefined,
            cardDetallada:undefined
            
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(response => response.json())
            .then(productos => {

                if(window.location.pathname === "/index.html"){
                    this.productos = productos
                }else if(window.location.pathname === "/farmacia.html"){
                    this.productos = productos.filter(producto => producto.categoria === "farmacia")
                }else if(window.location.pathname === "/juguete.html"){
                    this.productos = productos.filter(producto => producto.categoria === "jugueteria")
                }
                console.log(this.productos[0])
                this.parametroUrl= location.search
                this.parametro = new URLSearchParams(this.parametroUrl)
                this.id = this.parametro.get("id")
                this.cardDetallada = this.productos.find(elemento => elemento._id == this.id )
            })
    }
}).mount("#appIndex")
