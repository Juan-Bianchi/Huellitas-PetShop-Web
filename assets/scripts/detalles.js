const {createApp} = Vue;

createApp ( {
    data (){
        return {
            productosOrig: [],
            productosModif: [],
            producto: undefined,
            productosCarrito: [],
            totalCompra: 0,
            dataOrig: [],
            productos: [],
            productosConPropAgregadas: [],
            listaFiltrosPrecio: [],
            listaFiltrosMascota: [],
            listaFiltrosPromo: [],
            productosPorBusqueda:"",
            productosFiltradosFinal:[],
            checks:[],
            productosPromo3x2: ["63a28d36cc6fff6724518aa3", "63a28d38cc6fff6724518ab3", "63a28d38cc6fff6724518abd", "63a28d39cc6fff6724518abf"],
            productosOrdenadosPorPrecio: [],
            productosOrdenadosPorStock: [],
            unidades:0,
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

                if(window.location.pathname === "/index.html" ){
                    this.productos = [...this.productosModif];
                }else if(window.location.pathname === "/farmacia.html"){
                    this.productos = this.productosModif.filter(producto => producto.categoria === "farmacia")
                }else if(window.location.pathname === "/juguete.html"){
                    this.productos = this.productosModif.filter(producto => producto.categoria === "jugueteria")
                }

                this.agregarPropiedadesFiltrosChecks();
                this.generoListaChecks();
                this.productosFiltradosFinal= [...this.productos]

                this.producto = this.productosModif.find( prod => prod._id === id);

                this.productosFiltradosFinal= [...this.productos]
                

            })
            //.catch(err => console.error(err.message));
    },

    methods: {

        actualizarStockDeLocalStorage: function() {

            if(this.productosCarrito.length) {
                for(let producto of this.productosModif) {
                    for(let prodCarro of this.productosCarrito) {
                        if(prodCarro._id === producto._id) {
                            producto.disponibles = prodCarro.disponibles;
                            producto.cantPedida = prodCarro.cantPedida;
                            producto.subtotal = prodCarro.subtotal;
                            producto.descuento = prodCarro.descuento;
                            producto.total = prodCarro.total;
                        }

                    }
                }
            }
        },

        quitarDesdeCarrito: function(producto) {

            producto = this.actualizacionDePropiedades(producto, -1);
            console.log(producto)
            let arrayAux=[];
            if(!producto.cantPedida) {
                let indice = this.productosCarrito.indexOf(producto);
                console.log(indice)
                arrayAux = [... this.productosCarrito.slice(0,  indice)];
                console.log(arrayAux, indice)  
                this.productosCarrito = [... arrayAux.concat(this.productosCarrito.slice(indice+1))];
            }  
            this.producto = {... producto};
            localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
            this.sumaTotal();
            this.unidadesCarrito();
        },


        agregarDesdeCarrito: function(producto) {

            producto = this.actualizacionDePropiedades(producto, 1);
    
            if(!this.productosCarrito.some(prod => this.producto._id == prod._id)){
                this.productosCarrito.push(producto);
            }
            else {

                for(prod of this.productosCarrito) {
                    if(producto._id == prod._id) {
                        this.producto = {... producto};
                    }
                }
            }

            localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
            this.sumaTotal();
            this.unidadesCarrito();
        },


        agregarCarritoPorBoton: function(producto) {

            producto = this.actualizacionDePropiedades(producto, 1);
    
            if(!this.productosCarrito.some(prod => producto._id == prod._id)){
                this.productosCarrito.push(producto);
            }
            else {

                for(prod of this.productosCarrito) {
                    if(producto._id == prod._id) {

                        this.producto = {... producto};
                    }
                }
            }
            localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
            this.sumaTotal();
            this.unidadesCarrito();
        },

        actualizacionDePropiedades(prodAVender, acumulador) {
    
            prodAVender.disponibles -= acumulador;
            prodAVender.cantPedida += acumulador;
           

            if(prodAVender.cantPedida >= 3 && this.productosPromo3x2.some(prod => prod == prodAVender._id)) {
                prodAVender.descuento = ((Math.floor(prodAVender.cantPedida / 3 )) * prodAVender.precio);
            }
            else {
                prodAVender.descuento = 0;
            }
            prodAVender.subtotal = prodAVender.cantPedida * prodAVender.precio;
            prodAVender.total = prodAVender.subtotal - prodAVender.descuento;

            
            return prodAVender;
        },

        sumaTotal: function() {
            this.totalCompra = this.productosCarrito.reduce((acumulador, prod)=> acumulador += prod.total, 0)
        },

        limpiarLocalStorage: function() {
            localStorage.clear();
            this.productosCarrito = [];
            // location.reload();
        },

        agregarPropiedadesFiltrosChecks() {
            this.productosConPropAgregadas = this.productos.map( producto => {
                let masc;
                let precio;
                let promo;
                
                if(producto.descripcion.toLowerCase().includes('perr') || producto.producto.toLowerCase().includes('perr')) {
                    masc = 'Para tu perro';
                }
                else if(producto.descripcion.toLowerCase().includes('gat') || producto.producto.toLowerCase().includes('gat')) {
                    masc = 'Para tu gato';
                }
                else {
                    masc = 'Para ambos';
                }


                if(producto.precio <= 1000 ) {
                    precio = 'Hasta $1000';
                }
                else if(producto.precio > 1000 && producto.precio < 2000){
                    precio = 'De $1000 a $2000';
                }
                else {
                    precio = 'Más de $2000';
                }

                promo = this.productosPromo3x2.some(prod => prod.includes(producto._id))? 'Productos en promoción': 'No tienen promoción';
                return {
                    ... producto,
                    mascota: masc,
                    rangoPrecio: precio,
                    promocion: promo
                };
            });
        },

        generoListaChecks() {
            let listaFiltrosChecks = []
            let filtros = this.productosConPropAgregadas.map(prod => [ prod.mascota, prod.rangoPrecio, prod.promocion]);
            for(let filtro of filtros) {
                listaFiltrosChecks.push(...filtro);
            }
            listaFiltrosChecks = [... new Set(listaFiltrosChecks)].sort();
            this.listaFiltrosPrecio = listaFiltrosChecks.filter(categoria => categoria.startsWith('H') || categoria.startsWith('D') || categoria.startsWith('M'));
            this.listaFiltrosMascota = listaFiltrosChecks.filter(categoria => categoria.startsWith('Pa'));
            this.listaFiltrosPromo = listaFiltrosChecks.filter(categoria => categoria.startsWith('Pr'));
        },

        filtroCruzado: function(){
            let filtradoPorBusqueda = this.productosConPropAgregadas.filter(elemento => elemento.producto.toLowerCase().includes( this.productosPorBusqueda.toLowerCase()));
            if( this.checks.length === 0 ){
                this.productosFiltradosFinal = filtradoPorBusqueda;
                
            }else{
                let filtradosPorCheck = filtradoPorBusqueda.filter( producto => this.checks.includes( producto.mascota)||this.checks.includes( producto.rangoPrecio)||this.checks.includes( producto.promocion))
                console.log(filtradosPorCheck)
                this.productosFiltradosFinal = filtradosPorCheck; 
            }          
        },

        unidadesCarrito(){
            let contador=0
            for (let each of this.productosCarrito){
                contador+=each.cantPedida            }
            console.log(this.productosCarrito)
            this.unidades= contador
            console.log(this.unidades)
        }


    }

}).mount('#app')

