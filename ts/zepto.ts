/*
	尝试使用ES6标准的Javascript改写Zeptojs
	v1.0
	by:YWL


	已知问题：$('div','div')
			$('.a','div')没做除重
*/
((window) => {
	const fragmentRE = /^\s*<(\w+|!)[^>]*>/;
	let slice = (obj) => {
		//DOM的NodeList是类数组对象，不支持数组的一些方法如：forEach, map, filter等，
		//以下方法可以方便的把NodeList转为javascript数组对象。
		return Array.prototype.slice.call(obj);
	}

	//Zepto基类
	class Z {
		constructor(selector, context) {
			this.selector = selector;
			this.dom = [];
			this.init(selector, context);
		}
		private init(selector, context) {
			//对selector和context判断
			//selector粉6种情况，context4种

			if (!selector) {
				//选择器是空直接返回$空对象
				this.dom = [];
			} else if (selector instanceof Z) {
				//选择器本身是Z的实例，则返回相同实例
				this.dom = selector.dom;
				this.selector = selector.selector;
			} else if (typeof selector == 'string') {
				//选择器是字符串的情况
				selector = selector.trim();

				if (selector[0] == '<' && fragmentRE.test(selector)) {
					this.dom.push(document.createElement(selector.match(fragmentRE)[1]));
					//待填坑
					//考虑类似$('<div>dajf');
				} else {
					if (context != undefined) {
						if($.isEmptyZ(context)){
							this.dom = [];
							return;
						}else if($.isInstanceofZ(context)){
							this.dom = this.qsa(selector,context.dom);
						}else{
							//其余情况，context本身也是选择器
							console.log('here');
							this.dom = this.qsa(selector,$(context).dom);
						}
					} else {
						this.dom = this.qsa(selector, document);
					}
				}
			} else if($.isObject(selector)){
				//数组是html对象，如：document,window
				this.dom = [selector];
			}else {
				console.log('其他');
			}

		}
		private qsa(selector, context) {
			//核心函数
			//用途：返回dom集合

			let maybeId = selector[0] == '#';
			let maybeClass = selector[0] == '.';

			let dom = [];
			if ($.isArray(context)) {
				$.each(context, (k, v) {
					//递归调用
					$.each(dom, (k,v) =>{
						console.log(v === this.qsa(selector, v));
					})
					$.push(dom, this.qsa(selector, v))
				});
			} else {
				//querySelectorAll性能要差一些，优点是使用方便，后面再优化
				if (typeof context.querySelectorAll == 'function') {
					dom = slice(context.querySelectorAll(selector));
					return dom;
				} else {
					if (typeof context.getElementById == 'function') {
						if (maybeClass || maybeId) {
							selector = selector.slice(1);
						}
						if (maybeClass) {
							dom = context.getElementsByClassName(selector);
						} else if (maybeId) {
							dom = context.getElementById(selector);
						} else {
							dom = context.getElementsByTagName(selector);
						}
					}
				}
			}


			return dom;
		}
		private push(arr) {
			Array.prototype.push.apply(this.dom, arr);
		}

		each(callback) {
			$.each(this.dom, callback);
			return this;
		}

		find(selector) {
			let result;
			if (!selector) {
				return $();
			} else if (typeof selector == 'object') {
				return $();
			} else if (this.dom.length > 1) {
				console.log(this.dom);
				return $(selector, this.dom);
			} else {

			}
		}

		css(property, value) {
			console.log('css');
			return this;
		}

		consoleDom() {
			console.log(this.dom);
		}
	}

	//中间函数，直接使用静态方法，或者传参获得zepto对象
	let tool = (selector, context) => {
		return new Z(selector, context);
	}

	window.$ = window.Zepto = tool;


	$.isArray = (a) => {
		return Array.isArray(a) || (a instanceof Array);
	}
	$.isEmptyZ = (obj)=>{
		return (obj instanceof Z) && obj.dom && obj.dom.length == 0;
	}
	$.isInstanceofZ = (obj) => {
		return obj instanceof Z;
	}
	$.isFunction = (f) => {
		return true;
	}
	$.isObject = (obj) => {
		return typeof obj == 'object';
	}
	$.each = (arr, callback) => {
		if ($.isArray(arr)) {
			arr.forEach((v, k) => {
				if ($.isFunction(callback)) {
					callback(k, v);
				}
			});
		}
	}
	$.push = (mainArr, addArr) => {
		Array.prototype.push.apply(mainArr, addArr);
	}

})(window);