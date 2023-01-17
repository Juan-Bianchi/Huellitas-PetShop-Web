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
        }
    },
    created() {

        let urlString = location.search;
        let parameters = new URLSearchParams(urlString);
        let id = parameters.get('id');
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(response => response.json())
            .then(productos => {
                this.dataOrig = [... productos];
                if(window.location.pathname === "/index.html"){
                    this.productos = [...this.dataOrig];
                }else if(window.location.pathname === "/farmacia.html"){
                    this.productos = this.dataOrig.filter(producto => producto.categoria === "farmacia")
                }else if(window.location.pathname === "/juguete.html"){
                    this.productos = this.dataOrig.filter(producto => producto.categoria === "jugueteria")
                }
                
                this.agregarPropiedadesFiltrosChecks();
                this.generoListaChecks();
                this.productosFiltradosFinal= [...this.productos]
            })
    },


    methods: {

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
        }
        
            
        
    }

}).mount("#app")