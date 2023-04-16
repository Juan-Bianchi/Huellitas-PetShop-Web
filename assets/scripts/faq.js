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
            boxplace:1,
            navMenu: false,
        }
    },
    created() {
        document.addEventListener('focusin', this.focusChanged)

    },

    methods: {
        focusChanged(event) {
            const el = event.target
            if(el.id=='entrega') {this.entrega=1
                this.defecto=0
                this.tiempo=0
                this.precios=0
                this.factura=0
            }
            if(el.id=='defecto') {
                this.defecto=1
                this.entrega=0
                this.tiempo=0
                this.precios=0
                this.factura=0
            }
            if(el.id=='tiempo') {
                this.tiempo=1
                this.entrega=0
                this.defecto=0
                this.precios=0
                this.factura=0
            }
            if(el.id=='precios') {
                this.precios=1
                this.defecto=0
                this.tiempo=0
                this.entrega=0
                this.factura=0
            }
            if(el.id=='factura') {
                this.factura=1
                this.defecto=0
                this.tiempo=0
                this.precios=0
                this.entrega=0
            }
            this.boxplace=0
            console.log(el.id)
            
        },
        toggleMenu(){
            this.navMenu = !this.navMenu
        },
    }

}).mount("#appFAQ")