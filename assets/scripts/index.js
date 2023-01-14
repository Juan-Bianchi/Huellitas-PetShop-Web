const { createApp } = Vue
createApp({
    data() {
        return {
           productos:[],
        }
    },
    created() {
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
            .then(res => res.json())
            .then(datos => {
                this.productos = [...datos];
                console.log(this.productos)
                console.log(this.productos[0])
            })
           
            
    },
    methods: {

        
        
    },

}).mount('#vueIndex')