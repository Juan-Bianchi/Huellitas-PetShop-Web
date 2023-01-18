const { createApp } = Vue
createApp({
    data() {
        return {
            focus:null,
            entrega:null,
            defecto:null,
            tiempo:null,
            precios:null,
        }
    },
    created() {
        document.addEventListener('focusin', this.focusChanged)

    },

    methods: {
        focusChanged(event) {
            const el = event.target
            if(el.id=='entrega') this.entrega=1
            if(el.id=='defecto') this.defectos=1
            if(el.id=='tiempo') this.tiempo=1
            if(el.id=='precios') this.precios=1
            console.log(el.id)
            
        },
    }

}).mount("#appFAQ")