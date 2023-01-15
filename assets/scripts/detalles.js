const {createApp} = Vue;

createApp ( {
    data (){
        return {
            productosOrig: [],
            productosModif: [],
            producto: undefined,
            productosCarrito: [],
            productosPromo3x2: [],
            
        }
    },
    created(){
        let urlString = location.search;
        let parameters = new URLSearchParams(urlString);
        let id = parameters.get('id');

        fetch('https://mindhub-xj03.onrender.com/api/petshop')
            .then(resolve => resolve.json())
            .then(datosAPI => {
                this.productosOrig = [... datosAPI];
                this.productosModif = this.productosOrig.map(prod => {
                    return {
                        ...prod,
                        cantPedida: 0,
                        subtotal: 0,
                        descuento: 0,
                        total: 0,
                    }
                })
                this.productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
                this.actualizarStockDeLocalStorage();
                this.producto = this.productosModif.find( prod => prod._id === id);
                

            })
            //.catch(err => console.error(err.message));
    },

    methods: {

        actualizarStockDeLocalStorage(){

            if(this.productosCarrito.length) {
                for(let producto of this.productosModif) {
                    for(let prodCarro of this.productosCarrito) {
                        if(prodCarro._id === producto._id) {
                            producto = prodCarro;
                        }

                    }
                }
            }
        },

        manejarCarrito(prodAVender){

            prodAVender.disponibles --;
            prodAVender.cantPedida ++;

            if(prodAVender.cantPedida >= 3) {
                prodAVender.descuento = (prodAVender.cantPedida / 3 ) * prodAVender.precio;
            }
            prodAVender.subtotal = prodAVender.cantPedida * prodAVender.precio;
            prodAVender.total = prodAVender.subtotal - prodAVender.descuento;

            if(!this.productosCarrito.includes(prodAVender)){
                this.productosCarrito.push(prodAVender);
            }

            localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
        },


    }

}).mount('#app')

