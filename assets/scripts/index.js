const { createApp } = Vue
createApp({
    data() {
        return {
            productos: [],
            id: undefined,
            parametroUrl: "",
            parametro: undefined,
            cardDetallada: undefined,
            windowWidth: window.innerWidth,    
        }
    },

    mounted() {
        window.addEventListener('resize', this.onResize)
    },
    created() {
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(response => response.json())
            .then(productos => {
                this.productos = productos;
                this.parametroUrl = location.search
                this.parametro = new URLSearchParams(this.parametroUrl)
                this.id = this.parametro.get("id")
                this.cardDetallada = this.productos.find(elemento => elemento._id == this.id)
            })
    },
    methods: {
        onResize(event) {
            console.log('window has been resized', event)
            this.windowWidth = screen.width
            console.log(this.windowWidth)
        },
    }
}).mount("#appIndex")
