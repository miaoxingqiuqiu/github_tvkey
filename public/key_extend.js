//不规则列表对象，使用map映射关系进行按键处理
function MapObj ( info ) {
	var defaultOptions = {
		"list" : null,
		"index" : 0,
		"mapJson" : null,
		"MapItem" : "",
		"focusClass":"focus",
		"keyLeft" : function() {
			if ( this.MapItem == "" ) {
				return false;
			}
			var a = this.mapJson[this.MapItem].left;
			if ( a != null ) {
				this.changeFocus(a);
				return false;
			} else {
				return "left";
			}
		},
		"keyRight" : function() {
			if ( this.MapItem == "") {
				return false;
			}
			console.log(" mapJson " , this.mapJson);
			var a = this.mapJson[this.MapItem].right;
			if ( a != null   ) {
				this.changeFocus(a);
				return false;
			} else {
				return "right";
			}
		},
		"keyUp" : function() {
			if ( this.MapItem == "") {
				return false;
			}
			var a = this.mapJson[this.MapItem].up;
			if ( a != null ) {
				this.changeFocus(a);
				return false;
			} else {
				return "up";
			}
		},
		"keyDown" : function() {
			if ( this.MapItem == "" ) {
				return false;
			}
			var a = this.mapJson[this.MapItem].down;
			if ( a != null ) {
				this.changeFocus(a);
				return false;
			} else {
				return "down";
			}
		},
		"keyEnter" : function() {
		},
		"changeFocus" : function ( mapItem ) {
			if ( this.mapJson[mapItem] == undefined ) {
				return ;
			}
			var new_index = this.mapJson[mapItem].index;
			if ( new_index >= this.mapJson.count  ) {
				return ;
			}
			$(this.list[this.index]).removeClass(this.focusClass);
			this.index = this.mapJson[mapItem].index;
			this.MapItem = mapItem;
			$(this.list[this.index]).addClass(this.focusClass);
		}
		
	}
	this.options = $.extend({},defaultOptions,info);
}

MapObj.prototype = {
	removeFocus : function () {
		$(this.options.list[this.options.index]).removeClass(this.options.focusClass);
	},
	addFocus : function () {
		$(this.options.list[this.options.index]).addClass(this.options.focusClass);
	},
	getIndex : function () {
		return this.options.index;
	},
	keyFun : function (e) {
		e = e || window.event;
		switch ( e.keyCode ) {
			case 38:
				return this.options.keyUp();
				break;
			case 40:
				return this.options.keyDown();
				break;
			case 37:
				return this.options.keyLeft();
				break;
			case 39:
				return this.options.keyRight();
				break;
			case 13:
				return this.options.keyEnter();
				break;
		}
	}
}

//规则列表对象
function Rulelist ( info ) {
//	this._init_( info );
	var defaultOptions = {
			"content":null,
			"list" : null,
			"index" : 0,
			"rowCount" : 1,
			"colCount":5,
			"curRow":0,
			"curCol":0,
			"focusClass":"focus",
			"secClass" : "",
			"levelRefresh" : function () {
				//水平方向刷新数据或者切换div
		
			},
			"vetRefresh" : function () { 
				//垂直方向刷新数据或者切换div
			},
			"vetScroll" : function ( ulObj , nextObj ) {
				//垂直滚动
				var $contentQ = ulObj;
				var height = $contentQ.height();
				var minTop = $contentQ.scrollTop();
				var maxTop = minTop + height;
				var topPos = nextObj.offset().top - $contentQ.offset().top + minTop;
				var bottomPos = topPos + nextObj.height();
				if(minTop > topPos){ // 当前选择对象的上部被遮盖
					$contentQ.scrollTop(topPos);
					/*$contentQ.stop(false,true).animate({
				        scrollTop:topPos
					},200,function(){
					    
					});*/
				}else if(bottomPos > maxTop){ // 当前选择对象的下部被遮盖
			//		$contentQ.scrollTop(bottomPos - height);
					var scroll = $contentQ.scrollTop();
					$contentQ.scrollTop(scroll + nextObj.outerHeight(true));
					/*$contentQ.stop(false,true).animate({
				        scrollTop:bottomPos - height
					},200,function(){
					    
					});*/
				}
			},
			"keyLeft" : function() {
				var old_index = this.curRow * this.colCount + this.curCol;
				if ( this.curCol != 0 ) {
					this.curCol -= 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
					this.levelRefresh();
				} else {
					return "left";
				}
				return false;
			},
			"keyRight" : function() {
				var old_index = this.colCount * this.curRow + this.curCol;
				if ( this.curCol != this.colCount -1 && old_index != this.list.length -1 ) {
					this.curCol += 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
					this.levelRefresh();
				} else {
					return "right";
				}
				return false; 
			},
			"keyUp" : function() {
				var old_index = this.colCount * this.curRow + this.curCol;
				if ( this.curRow != 0 ) {
					this.curRow -= 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
					this.vetScroll(this.content,this.list.eq(this.index));
					this.vetRefresh();
				} else {
					return "up";
				}
				return false;
			},
			"keyDown" : function() {
				var old_index = this.colCount * this.curRow + this.curCol;
				if ( this.curRow != this.rowCount -1 && this.index + this.colCount < this.list.length ) {
					this.curRow += 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
					this.vetScroll( this.content,this.list.eq(this.index));
					this.vetRefresh();
				} else {
					return "down";
				}
				return false;
			},
			"keyEnter" : function() {
				return false;
			},
		}
		this.options = $.extend({},defaultOptions,info);
}

Rulelist.prototype = {
	//构造函数
//	constructor : Rulelist,
	//初始化列表和索引
	_init_ : function ( info ) {
		//默认参数
		
	},
	removeFocus : function () {
		if ( this.options.secClass == ""  ) {
			var extend_class = 	this.options.focusClass;
		} else {
			var extend_class = 	this.options.secClass;
		}
		this.options.list.eq(this.options.index).removeClass(extend_class);
	},
	addFocus : function () {
		if ( this.options.secClass == ""  ) {
			var extend_class = 	this.options.focusClass;
		} else {
			var extend_class = 	this.options.secClass;
		}
		this.options.list.eq(this.options.index).addClass(extend_class);
	},
	getIndex : function () {
		return this.options.index;
	},
	keyFun : function (e) {
		e = e || window.event;
		switch ( e.keyCode ) {
			case 38:
				return this.options.keyUp();
				break;
			case 40:
				return this.options.keyDown();
				break;
			case 37:
				return this.options.keyLeft();
				break;
			case 39:
				return this.options.keyRight();
				break;
			case 13:
				return this.options.keyEnter();
				break;
		}
	}
}

//ajax数据请求按键操作
function Ajaxdata ( info ) {
	var defaultOptions = {
			"ul":null,
			"list" : null,
			"index" : 0,
			"rowCount" : 0,
			"colCount":0,
			"curRow":0,
			"curCol":0,
			"focusClass":"focus",
			"secClass" : "",
			"pageSize" : 0,
			"totalPage" : 0,
			"currPage":1,
			"levelGetData" : function () {
				//左右按键数据刷新
			},
			"vetGetData" : function () { 
				//上下按键数据刷新
			},
			"keyLeft" : function() {
				var old_index = this.curRow * this.colCount + this.curCol;
				if ( this.curCol != 0 ) {
					this.curCol -= 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
				} else {
					if ( this.currPage > 1 ) {
						this.currPage -= 1;
						this.levelGetData();
					} else {
						return "left";
					}
				}
				return false;
			},
			"keyRight" : function() {
				var old_index = this.colCount * this.curRow + this.curCol;
				if ( this.curCol % this.colCount !=  this.colCount -1 && this.curCol < this.list.length - 1 ) {
					this.curCol += 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
				} else {
					                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
				}
				return false; 
			},
			"keyUp" : function() {
				var old_index = this.colCount * this.curRow + this.curCol;
				if ( this.curRow != 0 ) {
					this.curRow -= 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
					this.vetScroll(this.content,this.list.eq(this.index));
					this.vetGetData();
				} else {
					return "up";
				}
				return false;
			},
			"keyDown" : function() {
				var old_index = this.colCount * this.curRow + this.curCol;
				if ( this.curRow != this.rowCount -1 && this.index + this.colCount < this.list.length ) {
					this.curRow += 1;
					this.index = this.colCount * this.curRow + this.curCol;
					this.list.eq(old_index).removeClass(this.focusClass);
					this.list.eq(this.index).addClass(this.focusClass);
					this.vetScroll( this.content,this.list.eq(this.index));
					this.vetGetData();
				} else {
					return "down";
				}
				return false;
			},
			"keyEnter" : function() {
				return false;
			},
		}
		this.options = $.extend({},defaultOptions,info);
		this.options.levelGetData();
}

Ajaxdata.prototype = {
	removeFocus : function () {
		if ( this.options.secClass == ""  ) {
			var extend_class = 	this.options.focusClass;
		} else {
			var extend_class = 	this.options.secClass;
		}
		this.options.list.eq(this.options.index).removeClass(extend_class);
	},
	addFocus : function () {
		if ( this.options.secClass == ""  ) {
			var extend_class = 	this.options.focusClass;
		} else {
			var extend_class = 	this.options.secClass;
		}
		this.options.list.eq(this.options.index).addClass(extend_class);
	},
	getIndex : function () {
		return this.options.index;
	},
	keyFun : function (e) {
		e = e || window.event;
		switch ( e.keyCode ) {
			case 38:
				return this.options.keyUp();
				break;
			case 40:
				return this.options.keyDown();
				break;
			case 37:
				return this.options.keyLeft();
				break;
			case 39:
				return this.options.keyRight();
				break;
			case 13:
				return this.options.keyEnter();
				break;
		}
	}
}
