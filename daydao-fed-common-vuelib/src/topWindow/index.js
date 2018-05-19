/**
 * 提供往顶级iframe中插入组件的容器
 * 调用方法：
 * 1.引入：import topWindow from '../components/topWindow/index'
 * 2.传入组件：
 var instance1 = topWindow.init({
    render(h){
        //把showContent组件放到顶级的iframe中
        return h(showContent,{
            props:{
                myHandleClick(){
                    alert("aaaaa");
                }
                ,showText:"父级组件传过去的内容"
            }
        });
    }
 });
 * 其中第一个参数 showContent 为提前定义好的常规vue单文件组件对象
 * 其中第二个参数的 props对象为要传给showContent组件的一些参数，可以是回调方法，data数据等等...
 * 通过实例 instance1.$children[0] 可以获取到传入的组件对象
 * */
import Vue from 'vue';

const prefixCls = 'daydao-top-window';

const topWindow = {};
topWindow.init = (options) => {
    const _options = options || {};
    const Instance = new Vue({
        //合并参数
        data: Object.assign({}, _options, {
            body: ''
        }),
        //自定义渲染内容
        render (h) {
            // render content
            let body_render;
            if (this.render) {
                body_render = h('div', {
                    attrs: {
                        class: `${prefixCls}-body-render`
                    }
                }, [this.render(h)]);
            } else {
                body_render = h('div', {
                    attrs: {
                        class: `${prefixCls}-body`
                    }
                }, [
                    h('div', {
                        domProps: {
                            innerHTML: this.body
                        }
                    })
                ]);
            }

            return body_render;
        }
    });

    const component = Instance.$mount();
    top.document.body.appendChild(component.$el);
    return component;
};

export default topWindow;
