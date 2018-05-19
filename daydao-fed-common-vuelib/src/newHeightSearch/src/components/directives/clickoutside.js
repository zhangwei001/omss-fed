export default {
    bind (el, binding, vnode) {

        function documentHandler (e) {
            //custom control
            let otherContain = false;
            vnode.context.bindEl.forEach(els=>{
                let elArr = document.querySelectorAll(`.${els}`);
                for (let i = 0; i < elArr.length; i++) {
                    if (elArr[i].contains(e.target)) {
                       otherContain = true;
                       break; 
                    }
                }
            })

            if (el.contains(e.target) || otherContain) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);   
            }
        }

        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
};