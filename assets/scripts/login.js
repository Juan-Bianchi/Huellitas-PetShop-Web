const { createApp } = Vue

createApp({
    data() {
        return {
            
        }
    },
    
    created() {
        
    },
    methods: {
        girarFormulario: function (value) {
            let form = document.querySelector('.flip-card .flip-card-inner');
            if (value == 'front') {
                form.classList.add('girarFormulario');
            }
            else if (value == 'back') {
                form.classList.remove('girarFormulario');
            }
        },

    }
}).mount("#app")
