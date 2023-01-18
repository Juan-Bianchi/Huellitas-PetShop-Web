const { createApp } = Vue
createApp({
    data() {
        return {
            focus:null,
            entrega:null,
            defecto:null,
            tiempo:null,
            precios:null,
            factura:null,
        }
    },
    created() {
        document.addEventListener('focusin', this.focusChanged)

    },

    methods: {
        focusChanged(event) {
            const el = event.target
            if(el.id=='entrega') {this.entrega=1
                this.defectos=0
                this.tiempo=0
                this.precios=0
            }
            if(el.id=='defecto') {this.entrega=0
                this.defecto=1
                this.tiempo=0
                this.precios=0
            }
            if(el.id=='tiempo') {this.entrega=0
                this.defectos=0
                this.tiempo=1
                this.precios=0
            }
            if(el.id=='precios') {this.entrega=0
                this.defectos=0
                this.tiempo=0
                this.precios=1
            }
            if(el.id=='factura') {this.entrega=0
                this.defectos=0
                this.tiempo=0
                this.precios=0
                this.factura=1
            }
            console.log(el.id)
            
        },
    }

}).mount("#appFAQ")