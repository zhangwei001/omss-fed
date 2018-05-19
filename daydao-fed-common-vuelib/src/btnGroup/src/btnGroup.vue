<template>
	<div  class="page-btn-group">

		<span :class="['page-btn', {'page-btn-orange' : btn.active} , {'page-btn-more':btn.children&&btn.children.length>0}]" v-for="btn in reBtns" @click="btn.event" :style="{width : `${btn.width}px` || 'auto'}">
			{{btn.name}}
			<div class="page-btn-child-wrapper" v-if="btn.children &&  btn.children.length>0">
				<ul class="page-btn-list">
					<li v-for="item in btn.children" @click.stop="childrenClickHandler($event , item)">{{item.name}}</li>
				</ul>
			</div>
		</span>

	</div>
</template>

<script>

	export default {
		props: {
			btns:{
				type:Array,
				default(){
					return [];
				}
			}
		},
		computed:{
			reBtns(){
				this.btns.forEach(item=>{
					if (!item.event) item.event = ()=>{};
				})

				return this.btns
			}
		},
		methods:{
			childrenClickHandler(e , item){
				item.event();

				let target = e.target;
                while (target && target.tagName !== 'DIV') {
                   target = target.parentNode;
                }

                target.style.display = 'none';

                setTimeout(_=>{
                    target.style.display = '';
                },400)
			}
		}
	}

</script>






<style lang="scss">
	@import "../../styles/animation/slideDown.scss";

	$preCls : '.page-btn';


	.page-btn-group{
		display: flex;

		#{$preCls} {
			line-height: 30px;
			padding: 0 11px;
			display: inline-block;
			margin-right: 10px;
			background-color: #fff;
			border: 1px solid #C3CAD3;
			border-radius: 2px;
			color: #657180;
			font-size:14px;
			cursor: pointer;
			flex :0 0 auto;
			text-align: center;

			&-orange{
				background-color: #F18950;
				border-color: #F18950;
				color: #fff;

                &:hover{
                    background-color:#F8925A;
                }
                &:active{
                    background-color:#E6773B;
                }
			}

			&-more{
				position: relative;
				padding: 0 14px;

                &:hover{
                    border-color: #A1ADBB;
                    color: #808D9D;
                }
                &:active{
                    border-color: #939FAE;
                    color: #576372;
                }

				&:after{
					content: "";
				    display: inline-block;
				    width: 0;
				    height: 0;
				    border: 5px solid transparent;
				    border-top: 5px solid #657180;
				    position: relative;
				    top: 2px;
				    left: 2px;
				    transform-origin: 5px 2.5px;
				}

				&:hover >div#{$preCls}-child-wrapper{
					display:block;
                    -webkit-animation: slideDown-in .3s forwards;
                    -moz-animation: slideDown-in .3s forwards;
                    -ms-animation: slideDown-in .3s forwards;
                    animation: slideDown-in .3s forwards;
				}

				&:hover:after{
					transform: rotate(180deg);
				}
			}

			&-child-wrapper{
				width: 100%;
			    height: 22px;
			    position: absolute;
			    top: 20px;
			    left: 0;
			    z-index: 109;
			    display: none;
			}

			&-list{
				margin-top:13px;
			    background: #fff;
			    width: 100%;
			    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);

			    li{
			    	height: 30px;
			    	line-height: 30px;
    				text-align: center;
    				&:hover{
    					background-color:#F5F7F9;
    				}
			    }
			}
		}
	}



</style>
