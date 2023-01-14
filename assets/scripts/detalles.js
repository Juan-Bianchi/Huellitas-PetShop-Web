const {createApp} = Vue;

createApp ( {
    data (){
        return {
            productos: [],
            producto: undefined,

        }
    },

    created(){
        let urlString = location.search;
        let parameters = new URLSearchParams(urlString);
        let id = parameters.get('id');

        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(resolve => resolve.json())
            .then(datosAPI => {
                this.productos = [... datosAPI];
                this.producto = this.productos.find( prod => prod._id === id);
            })
            .catch(err => console.error(err.message));
    }

}).mount('#app')