const { createApp } = Vue

createApp({
    data(){
        return{
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
            productosCarrito: [],
            productosModif: [],
            unidades: 0,
            totalCompra: 0,
            valorOrdenamiento: 0,
            windowWidth: window.innerWidth,
        }
    },
    created() {
        window.addEventListener('resize', this.onResize);

        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(response => response.json())
            .then(productos => {
                this.dataOrig = productos.map(producto => ({... producto}));
                if(window.location.pathname === "/index.html"){
                    this.productos = this.dataOrig.map( prod => ({... prod}));
                }else if(window.location.pathname === "/farmacia.html"){
                    this.productos = this.dataOrig.filter(producto => producto.categoria === "farmacia")
                }else if(window.location.pathname === "/juguete.html"){
                    this.productos = this.dataOrig.filter(producto => producto.categoria === "jugueteria")
                }
                this.productosModif = this.dataOrig.map(prod => {
                    return {
                        ... prod,
                        cantPedida: 0,
                        subtotal: 0,
                        descuento: 0,
                        total: 0,
                    }
                })
                
                this.administrarDatos();
            })
    },

    mounted(){
        
    },


    methods: {

        // CARGA DE DATOS DE API Y DE LOCAL STORAGE

        administrarDatos: function(){
            this.agregarPropiedadesFiltrosChecks();
            this.generoListaChecks();
            this.productosFiltradosFinal= this.productos.map(prod => ({... prod}));
            this.productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
            this.unidades = this.productosCarrito.length;
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
            let listaFiltrosChecks = this.productosConPropAgregadas
                                        .map(prod => [ prod.mascota, prod.rangoPrecio, prod.promocion])
                                        .reduce(function(a, b){
                                            return a.concat(b);
                                        });
            
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


        // MODIFICACIONES CARRITO 

        sumaTotal: function() {
            this.totalCompra = this.productosCarrito.reduce((acumulador, prod)=> acumulador += prod.total, 0)
        },


        agregarDesdeCarrito: function(producto) {
            
            producto.cantPedida ++;
            if(producto.cantPedida >= 3 && this.productosPromo3x2.some(prod => prod == producto._id)) {
                producto.descuento = ((Math.floor(producto.cantPedida / 3 )) * producto.precio);
            }
            producto.subtotal = producto.cantPedida * producto.precio;
            producto.total = producto.subtotal - producto.descuento;
            localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
            this.sumaTotal();
        },


        quitarDesdeCarrito: function(producto) {

            if(producto.cantPedida == 1) {
                producto.cantPedida --;
                console.log(this.productosCarrito.findIndex(prod => producto._id == prod._id));
                this.productosCarrito.splice(this.productosCarrito.findIndex(prod => producto._id == prod._id),1);
                this.unidades = this.productosCarrito.length;
            }
            else {
                producto.cantPedida --;
                if(producto.cantPedida >= 3 && this.productosPromo3x2.some(prod => prod == producto._id)) {
                    producto.descuento = ((Math.floor(producto.cantPedida / 3 )) * producto.precio);
                }
                else{
                    producto.descuento = 0;
                }
            }
            producto.subtotal = producto.cantPedida * producto.precio;
            producto.total = producto.subtotal - producto.descuento;  
            localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
            this.sumaTotal();
        },


        agregarCarritoPorBoton: function(producto) {

            if(!this.productosCarrito.some(prod => producto._id === prod._id)){
                console.log(producto);
                let prod = this.productosModif.find(product => product._id == producto._id);
                prod.cantPedida ++;
                prod.subtotal = prod.cantPedida * prod.precio;
                prod.total = prod.subtotal;
                this.productosCarrito.push(prod);
                this.unidades = this.productosCarrito.length;
            }
            else {
                let producAAgregar = this.productosCarrito.find(prod => producto._id === prod._id)
                producAAgregar.cantPedida ++;
                if(producAAgregar.cantPedida >= 3 && this.productosPromo3x2.some(prod => prod == producto._id)) {
                    producAAgregar.descuento = ((Math.floor(producAAgregar.cantPedida / 3 )) * producAAgregar.precio);
                }
                producAAgregar.subtotal = producAAgregar.cantPedida * producAAgregar.precio;
                producAAgregar.total = producAAgregar.subtotal - producAAgregar.descuento;
                
            }

            localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
            this.sumaTotal();
        },

        limpiarLocalStorage: function() {
            localStorage.clear();
            this.productosCarrito = [];
            this.unidades = this.productosCarrito.length;
            this.productosModif.forEach(producto => {
                producto.cantPedida = 0;
                producto.subtotal = 0;
                producto.total = 0;
            });
        },


        // ORDENAMIENTO

        renderizarOrdenado: function(){
            
            if(this.valorOrdenamiento === '1'){
                this.productosFiltradosFinal.sort(function (a, b){
                    return a.disponibles - b.disponibles;
                }).reverse();
                console.log(this.productosFiltradosFinal)
            }
            if(this.valorOrdenamiento === '2'){
                this.productosFiltradosFinal.sort(function (a, b){
                    return a.disponibles - b.disponibles;
                });
            }
            if(this.valorOrdenamiento === '3'){
                this.productosFiltradosFinal.sort(function (a, b){
                    return a.precio - b.precio;
                }).reverse();
            }
            if(this.valorOrdenamiento === '4'){
                this.productosFiltradosFinal.sort(function (a, b){
                    return a.precio - b.precio;
                });
            }
        },

        onResize(event) {
            this.windowWidth = screen.width
        },

    }

}).mount("#app")
