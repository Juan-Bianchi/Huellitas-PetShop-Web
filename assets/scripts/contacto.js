const { createApp } = Vue

createApp({
    data() {
        return {
            productos: [],
            mensaje: "",
            mascota: "",
            otraMascota: "",
            telefonoUsuario: "",
            nombreUsuario: "",
            emailUsuario: "",
            comentariosUsuario: [],
        }
    },
    
    created() {
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

                this.comentariosUsuario=JSON.parse(localStorage.getItem('comentarios')) || []

            })
    },
    methods: {

        limpiarForm() {
            this.mensaje = ""
            this.mascota = ""
            this.otraMascota = ""
            this.telefonoUsuario = ""
            this.nombreUsuario = ""
            this.emailUsuario = ""
            console.log(this.comentariosUsuario)
        },

        localStorageComentario() {
            let comentario = { nombre: this.nombreUsuario, telefono: this.telefonoUsuario, email: this.emailUsuario, mascota: this.mascota ? this.mascota : this.otraMascota, mensaje: this.mensaje }
            this.comentariosUsuario.push({...comentario})
            console.log(this.comentariosUsuario)
            localStorage.setItem('comentarios', JSON.stringify(this.comentariosUsuario))
        },

    }
}).mount("#appContacto")
