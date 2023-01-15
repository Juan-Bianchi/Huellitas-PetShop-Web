const { createApp } = Vue

createApp({
    data(){
        return{
            dataOrig: [],
            productos: [],
            productosConPropAgregadas: [],
            listaFiltrosChecks: [],

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
            })
    },


    methods: {
        agregarPropiedadesFiltrosChecks() {
            this.productosConPropAgregadas = this.productos.map( producto => {
                let masc;
                let precio;

                
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
                    precio = 'Precio Bajo';
                }
                else if(producto.precio > 1000 && producto.precio < 2000){
                    precio = 'Precio Intermedio';
                }
                else {
                    precio = 'Precio Alto';
                }

                
                return {
                    ... producto,
                    mascota: masc,
                    rangoPrecio: precio
                };
            });
        },

        generoListaChecks() {
            let filtros = this.productosConPropAgregadas.map(prod => [ prod.mascota, prod.rangoPrecio]);
            for(let filtro of filtros) {
                this.listaFiltrosChecks.push(...filtro);
            }
            this.listaFiltrosChecks = [... new Set(this.listaFiltrosChecks)].sort();
        }
            
        
    }

}).mount("#app")