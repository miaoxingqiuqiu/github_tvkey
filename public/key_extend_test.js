function keyBinds(_Obj){
	document.onkeydown = function(evt){
		var key_code = event.which ? event.which: event.keyCode;
		switch (key_code) {
			case 38:
				_Obj.keyUp();
				return 0;
				break;
			case 40:
				_Obj.keyDown();
				return 0;
				break;
			case 37:
				_Obj.keyLeft();
				return 0;
				break;
			case 39:
				_Obj.keyRight();
				return 0;
				break;
			case 13:
				_Obj.keyEnter();
				return 0;
				break;
			case 8:
				_Obj.comeBack();
				return 0;
				break;
			case 33:
				_Obj.pageUp();
				return 0;
				break;
			case 34:
				_Obj.pageDown();
				return 0;
				break;
			default:
				return key_code;
				break;
		}
	};
};

//Label类(将要操作的dom相关信息)
var GetLabelData = function ( _parentObjId , _focusId ) {
	var labelObjs = [];//保存相关的dom节点
	var curLabelIndex = 0;//当前节点索引
	var parentId = _parentObjId;//父节点id
	//获取存储的dom节点
	this.getLabelObjs = function () {
		return labelObjs;
	};
	this.getParentObj = function () {
		return document.getElementById(_parentObjId);
	};
	//获取当前活动的dom节点
	this.getCurLabelObj = function () {
		return labelObjs[curLabelIndex];
	};
	//获取当前活动的dom节点的索引
	this.getCurLabelIndex = function () {
		return curLabelIndex;
	};
	//设置当前的焦点位置
	this.setCurLabelIndex = function ( _num ) {
		if ( _num < labelObjs.length ) {
			curLabelIndex = _num;
		}
	};
	//设置添加dom存储数组
	this.setLabelObjs = function () {
		//可以传进来，使用js操作获取原生dom节点
		try{
			labelObjs = [];
			var list = document.getElementById(parentId).children;
			for ( var i = 0 ; i < list.length ; i++ ) {
				if ( list[i].nodeType == 1 && list[i].id.indexOf(parentId) > -1) {
					labelObjs.push(list[i]);
				}
			}
		}catch(err){}
	};
	//设置初始化的id所在的index
	this.setCurLabelIndexByInitFocusId = function ( _focusId ) {
		try{
			for ( var i in labelObjs ) {
				if ( labelObjs[i].id == _focusId ) {
					curLabelIndex = parseInt(i);
					break;
				}
			}
		}catch(err){}
	}
}

//规则型数组
var BaseAreaData = function ( _parentId , _focusId, _focusClass , _stepMap , _areaMap ) {
	GetLabelData.call(this,_parentId,_focusId);//继承父类
	this.parentId = _parentId;
	this.focusClass = _focusClass;
	var stepMap = [1,0];
	var areaMapLeft,areaMapRight,areaMapTop,areaMapBottom;
	//设置二维数组记录x和y每次所走的步数
	this.setStepMap = function ( _obj ){
		if ( _obj.length == 2 && _obj[0] > -1 && _obj[1] > -1 ) {
			stepMap = _obj;
		}
	};
	//获取二维数组每次所走的步数
	this.getStepMap = function () {
		return stepMap;
	};
	//设置左侧焦点模块对象
	this.setAreaMapLeft = function ( obj ) {
		try{
			//如果要切换的模块有节点，则可以进行左侧焦点切换
			if ( obj.getLabelObjs().length > 0 ) {
				areaMapLeft = obj;
			}
		}catch(error){
			areaMapLeft = null;
		}
	};
	//设置右侧焦点模块对象
	this.setAreaMapRight = function ( obj ) {
		try{
			//如果要切换的模块有节点，则可以进行左侧焦点切换
			console.log("### obj.getLabelObjs().length ###" ,obj.getLabelObjs());
			if ( obj.getLabelObjs().length > 0 ) {
				areaMapRight = obj;
			}
		}catch(error){
			areaMapRight = null;
		}
	};
	//设置上侧焦点模块对象
	this.setAreaMapTop = function ( obj ) {
		try{
			//如果要切换的模块有节点，则可以进行左侧焦点切换
			if ( obj.getLabelObjs().length > 0 ) {
				areaMapTop = obj;
			}
		}catch(error){
			areaMapTop = null;
		}
	},
	//设置下侧焦点模块对象
	this.setAreaMapBottom = function ( obj ) {
		try{
			//如果要切换的模块有节点，则可以进行左侧焦点切换
			if ( obj.getLabelObjs().length > 0 ) {
				areaMapBottom = obj;
			}
		}catch(error){
			areaMapBottom = null;
		}
	};
	this.getAreaMapLeft = function (){ 
		return areaMapLeft;
	};
	this.getAreaMapRight = function (){ 
		return areaMapRight;
	};
	this.getAreaMapTop = function (){
		return areaMapTop;
	};
	this.getAreaMapBottom = function (){ 
		return areaMapBottom;
	};
	this.setAreaMap = function ( obj ) {
		try{
			if ( obj != undefined && obj.length > 0 ) {
				this.setAreaMapLeft(obj[0].Left);
				this.setAreaMapRight(obj[0].Right);
				this.setAreaMapTop(obj[0].Top);
				this.setAreaMapBottom(obj[0].Bottom);
			}
		} catch (error){};
		
	};
	//初始化数据
	this.initData = function () {
		this.setLabelObjs();
		try{
			var focusId = "";
			this.setCurLabelIndexByInitFocusId(_focusId);
		}catch(error){
			this.setCurLabelIndexByInitFocusId(_focusId);
		}
		this.setStepMap(_stepMap);
		this.setAreaMap(_areaMap);
		this.loadAssetData();
	}
}
BaseAreaData.prototype = {
	//将按键处理给调用对象，且dom添加焦点样式
	startRun : function () {
		this.onFocus();
		keyBinds(this);	
	},
	//添加焦点
	onFocus : function () {
		this.getCurLabelObj().className = this.focusClass;
	},
	//移除焦点
	lostFocus : function () {
		this.getCurLabelObj().className = "";
	},
	//焦点移动
	navPosChange : function ( _num ) {
		if ( this.getCurLabelIndex() + _num > -1 && this.getCurLabelIndex() + _num < this.getLabelObjs().length ) {
			this.lostFocus();
			this.setCurLabelIndex(this.getCurLabelIndex() + _num);
			this.onFocus();
			this.vetScroll();
			this.levelScroll();
		}
	},
	//垂直滚动
	vetScroll : function () {
//		console.log(" scrollHeight =  " + $("#" + this.parentId).prop("scrollHeight") + " height = " + $("#" + this.parentId).outerHeight(true));
		if ( $("#" + this.parentId).prop("scrollHeight") <= $("#" + this.parentId).height() ) {
			return;
		}
		var $contentQ = $("#" + this.parentId);
		var height = $contentQ.height();
		var minTop = $contentQ.scrollTop();
		var maxTop = minTop + height;
		var topPos = $(this.getCurLabelObj()).offset().top - $contentQ.offset().top + minTop;
		var bottomPos = topPos + $(this.getCurLabelObj()).outerHeight();
		if(minTop > topPos){ // 当前选择对象的上部被遮盖
			$contentQ.scrollTop(topPos);
		}else if(bottomPos > maxTop){ // 当前选择对象的下部被遮盖
			var scroll = $contentQ.scrollTop();
			$contentQ.scrollTop(scroll + $(this.getCurLabelObj()).outerHeight(true));
		}
	},
	//水平滚动
	levelScroll : function () {
		if ( $("#" + this.parentId).parent().width() >= $("#" + this.parentId).width() ) {
			return;
		}
		var $contentQ = $("#" + this.parentId).parent();
		var width = $contentQ.width();
		var minLeft = $contentQ.scrollLeft();
		var maxLeft = minLeft + width;
		var leftPos = $(this.getCurLabelObj()).offset().left - $contentQ.offset().left + minLeft;
		var rightPos = leftPos + $(this.getCurLabelObj()).outerWidth(true);
		if(minLeft > leftPos){//当前选择对象的左侧被覆盖
			$contentQ.scrollLeft(leftPos);
		}else if( rightPos > maxLeft ) { // 当前选择对象的右边被遮盖
			var scroll = $contentQ.scrollLeft();
			$contentQ.scrollLeft(scroll + $(this.getCurLabelObj()).outerWidth(true));
		}
	},
	//加载数据，可自定义
	loadAssetData : function () {
		
	},
	//清空数据，可自定义
	delAssetData : function () {
		
	},
	//上下按键，切换div或者刷新数据
	vetChange : function () {
	
	},
	//左右按键，切换div或者刷新数据
	levelChange : function () {
		
	},
	setAreaMap2 : function ( obj ) {
		this.setAreaMap( obj );
	},
	//模块对象切换
	navAreaChange : function ( obj ) {
		try{
			if ( obj.getLabelObjs().length > 0 ) {
				this.lostFocus();
				//设置初始化index
				
				obj.startRun();
			}
		} catch (err){}
	},
	keyLeft : function () {
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var index = this.getCurLabelIndex();
		if ( y > 1 ) {
			//多行多列
			if ( index % y == 0 ) {
				this.navAreaChange(this.getAreaMapLeft());
			} else {
				this.navPosChange(-x);
			}
		} else {
			//一行多列或者多行一列
			if ( index-x > -1 && index-x < index ) {
				this.navPosChange(-x);
			} else {
				this.navAreaChange(this.getAreaMapLeft());
			}
		}
	},
	keyRight : function () {
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var index = this.getCurLabelIndex();
		var len = this.getLabelObjs().length;
		if ( y > 1 ) {
			//多行多列
			if ( index % y == y-1 && index <= len - 1 ) {
				this.navAreaChange(this.getAreaMapRight());
			} else {
				this.navPosChange(x);
			}
		} else {
			//一行多列或者多行一列
			if ( index+x > index && index+x < len ) {
				this.navPosChange(x);
			} else {
				this.navAreaChange(this.getAreaMapRight());
			}
		}	
	},
	keyUp : function () {
		var y = this.getStepMap()[1];
		var index = this.getCurLabelIndex();
		if ( index-y > -1 && index-y < index ) {
			this.navPosChange(-y);
		} else {
			this.navAreaChange(this.getAreaMapTop());
		}
	},
	keyDown : function () {
		var y = this.getStepMap()[1];
		var index = this.getCurLabelIndex();
		var len = this.getLabelObjs().length;
		if ( index+y > index && index+y < len ) {
			this.navPosChange(y);
		} else {
			this.navAreaChange(this.getAreaMapBottom());
		}
	},
	keyEnter : function () {
		//OK键处理
	},
} 

//不规则形排列
var BaseAreaData2 = function ( _parentId , _focusId, _focusClass ,_setpMap,  _areaMap, _menuMap ) {
	BaseAreaData.call(this,_parentId,_focusId,_focusClass ,_setpMap,  _areaMap);//继承父
	var menuMap = _menuMap;
};
BaseAreaData2.prototype = {
	startRun : function () {
		this.onFocus();
		keyBinds(this);	
	},
	//添加焦点
	onFocus : function () {
		this.getCurLabelObj().className = this.focusClass;
	},
	//移除焦点
	lostFocus : function () {
		this.getCurLabelObj().className = "";
	},
	//加载数据
	loadAssetData : function () {
		
	},
	//清除数据
	delAssetData : function () {
		
	},
	//焦点切换
	navPosChange : function ( index ) {
		this.lostFocus();
		this.setCurLabelIndex( index );
		this.onFocus();
	},
	//区域切换
	navAreaChange : function ( obj ) {
		try {
			if ( obj.getLabelObjs().length > 0 ) {
				this.lostFocus();
				obj.startRun();
			}
		}catch(error){}
	},
	//左键处理
	keyLeft : function () {
		var index = this.getCurLabelIndex();
		var pos = menuMap[index].left;
		if ( pos != undefined ) {
			var curIndex = menuMap[pos].index;
			this.navPosChange(curIndex);
		} else {
			this.navAreaChange(this.getAreaMapLeft());
		}
	},
	//右键处理
	keyRight : function () {
		var index = this.getCurLabelIndex();
		var pos = menuMap[index].right;
		if ( pos != undefined ) {
			var curIndex = menuMap[pos].index;
			this.navPosChange(curIndex);
		} else {
			this.navAreaChange(this.getAreaMapRight());
		}
	},
	//上键处理
	keyUp : function () {
		var index = this.getCurLabelIndex();
		var pos = menuMap[index].up;
		if ( pos != undefined ) {
			var curIndex = menuMap[pos].index;
			this.navPosChange(curIndex);
		} else {
			this.navAreaChange(this.getAreaMapTop());
		}
	},
	//下键处理
	keyDown : function () {
		var index = this.getCurLabelIndex();
		var pos = menuMap[index].down;
		if ( pos != undefined ) {
			var curIndex = menuMap[pos].index;
			this.navPosChange(curIndex);
		} else {
			this.navAreaChange(this.getAreaMapDown());
		}
	}
}

//数据分页加载对象
var SidePageData = function ( _parentId , _focusId, _focusClass ,_stepMap,  _areaMap, _urlPage , _borderMap ){
	BaseAreaData.call(this,_parentId,_focusId,_focusClass ,_stepMap,  _areaMap);//继承父类
	var curPageNum = 1;//当前页码
	var totalPageNum = 1;//总页数
	var curPageAssets = [];//保存当前页的数据
	this.urlPage = _urlPage;//设置当前ajax请求的地址，不带参数
	this.borderMap = _borderMap;//设置当前数据加载区边界的处理方法，Page为边界翻页，Arae为边界切换区域
	this.loadStatus = true;//加载请求状态
	this.SETTIMER = null;//计时器，判断请求超时
	this.setCurPageNum = function ( num ) {
		var num = parseInt(num);
		curPageNum = num;
	}
	this.getCurPageNum = function () {
		return curPageNum;
	}
	//重新设置当前页数据
	this.setCurPageAssets = function ( objList ) {
		curPageAssets = objList;
	}
	this.getCurPageAssets = function () {
		return curPageAssets;
	}
	this.getCurPageAssetsLen = function () {
		return curPageAssets.length;
	}
	this.setTotalPageNum = function ( totalNum ) {
		var num = parseInt(totalNum);
		totalPageNum = num;
	}
	this.getTotalPageNum = function () {
		return totalPageNum;
	}
	this.initData = function (){
		this.setLabelObjs();//获取当前页的所有节点
		try{
			
		}catch (error){}
		var pageNum = 1;
		if ( pageNum != null ){
			this.setCurPageNum( pageNum );
		}
		//加载数据
		this.getAjaxFunInit();
		this.setCurLabelIndexByInitFocusId(_focusId);
		this.setStepMap( _stepMap );
		this.setAreaMap( _areaMap );
		
	};
	//初始化页面数据
	this.getAjaxFunInit = function () {
		this.setAjaxUrl();
		var xmlhttp;
		var that = this;
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",this.ajaxUrl);
		xmlhttp.onreadystatechange = function () {
			if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
				var str = xmlhttp.responseText;
				try{
					var obj = JSON.parse(str);
					that.sucess(obj);

					if ( that.getCurPageNum() > 1 ) {
						//如果当前页大于第一页，则显示上箭头或者左箭头
						that.showUpOrLeftTag();
					}
			//		console.log("#### that.getTotalPageNum() = " + that.getTotalPageNum());
					console.log(" this.getCurPageNum() =" + that.getCurPageNum() + " this.getTotalPageNum() = " + that.getTotalPageNum());
					if ( that.getCurPageNum() < that.getTotalPageNum() ) {
						//如果当前页小于最后一页，则显示下箭头或者右箭头
						that.showDownOrRightTag();
					}else {
						that.hideDownOrRightTag();
					}
				} catch(err){
					var obj = null;
				}
			} else {
				that.setTotalPageNum(1);
				that.error();
			}
		}
		xmlhttp.send();
	}
	//上下键翻页数据加载
	this.getAjaxFunPage = function ( pos ) {
		if ( this.loadStatus == true ) {//如果当前请求状态为true，则发送请求
			this.loadStatus = false;
			var xmlhttp;
			var that = this;
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET",this.ajaxUrl);
			xmlhttp.timeout = 2000; 
			xmlhttp.onreadystatechange = function () {
				if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
					var str = xmlhttp.responseText;
					that.loadStatus = true;//可以进行下次请求
					clearTimeout(that.SETTIMER);
					try{
						var obj = JSON.parse(str);
						that.sucess(obj);
						if ( pos > that.getCurPageAssetsLen() -1 ) {
							pos = that.getCurPageAssetsLen() -1;
						}
						that.lostFocus();
						that.setCurLabelIndex(pos);
						that.onFocus();
						if ( that.getCurPageNum() == that.getTotalPageNum() ) {
							that.hideDwonOrRightTag();
						} else if( that.getCurPageNum() == 1 ){
							that.hideUpOrLeftTag();
						} else {
							that.showUpOrLeftTag();
							that.showDwonOrRightTag();
						}
					} catch(err){
						var obj = null;
					}
				} else {
					that.setTotalPageNum(1);
					that.error();
				}
			}
			xmlhttp.send();
			this.SETTIMER = setTimeout(function(){
				//超时处理
				if ( that.loadStatus == false ) {
					xmlhttp.abort();
					that.loadStatus = true;//可以进行下次请求
				}
			},2000);
			
		}
	}	
}

SidePageData.prototype = {
	startRun : function () {
		this.onFocus();
		keyBinds(this);	
	},
	//添加焦点
	onFocus : function () {
		this.getCurLabelObj().className = this.focusClass;
	},
	//移除焦点
	lostFocus : function () {
		this.getCurLabelObj().className = "";
	},
	setAreaMap2 : function ( obj ) {
		this.setAreaMap( obj );
	},
	//ajax请求成功后的函数处理
	sucess : function ( objList ) {
		this.delPageAssets();
		this.loadPageAssets( objList );
	},
	//ajax请求失败或者不能获取数据
	error : function () {
		
	},
	setUrlPage : function ( url ) {
		this.urlPage = url;
		this.setCurPageNum(1);
	},
	//设置总的请求地址
	setAjaxUrl : function () {
		if ( typeof (this.urlPage) != undefined && this.urlPage.indexOf("?") > -1 ) {
			//url后面带了参数
			this.ajaxUrl = this.urlPage +"&pageSize=" + this.getLabelObjs().length + "&pageYema=" + this.getCurPageNum();
		} else {
			this.ajaxUrl = this.urlPage +"?pageSize=" + this.getLabelObjs().length + "&pageYema=" + this.getCurPageNum();
		}
	},
	//显示或者隐藏上下左右箭头,用户可自定义重载以下四个函数
	showUpOrLeftTag: function () {
		
	},
	showDwonOrRightTag: function () {
		
	},
	hideUpOrLeftTag: function () {
		
	},
	hideDwonOrRightTag: function () {
		
	},
	//列表清除数据,用户进行重载
	delPageAssets : function () {
		
	},
	//列表加载数据，用户进行重载
	loadPageAssets : function (obj) {
		
	},
	//上下按键，切换div或者刷新数据
	vetChange : function () {
	
	},
	//左右按键，切换div或者刷新数据
	levelChange : function () {
		
	},
	  //区域切换
	navAreaChange : function ( obj ) {
		try {
			if ( obj.getLabelObjs().length > 0 && obj.getCurPageAssetsLen() > 0) {
				this.lostFocus();
				obj.startRun();
			}
		}catch(error){}
	},
	//焦点切换
	navPosChange : function ( num ) {
		var num = this.getCurLabelIndex() + num;
		var length = this.getLabelObjs().length;
		var maxIndex = this.getCurPageAssetsLen() - 1;
		
		if ( num >= 0 && num <=  maxIndex ) {
			this.lostFocus();
			this.setCurLabelIndex( num );
			this.onFocus();
			this.vetChange();
		} else if ( num > length - 1 && this.getCurPageNum() < this.getTotalPageNum() ) {
			var pageNum = this.getCurPageNum();
			this.setCurPageNum( pageNum + 1 );
			this.setAjaxUrl();
			var pos = num - length;
			//加载数据,且进行焦点切换
			this.getAjaxFunPage( pos );
		} else if ( num < 0 && this.getCurPageNum() > 1 ) {
			var pageNum = this.getCurPageNum();
			this.setCurPageNum( pageNum - 1 );
			this.setAjaxUrl();
			var pos = num + length;
			//加载数据,且进行焦点切换
			this.getAjaxFunPage( pos );
		}
	},
	
	pageDownFun : function ( offset ) {
		var pageNum = this.getCurPageNum();
		var totalPageNum = this.getTotalPageNum();
		if ( pageNum < totalPageNum && this.loadStatus == true ) {
			this.setCurPageNum( pageNum + 1);
			this.setAjaxUrl();//重新设置ajaxUrl，准备发送请求
			console.log(" this.ajaxUrl " + this.ajaxUrl);
			//发送请求
			this.loadStatus = false;
			var xmlhttp;
			var that = this;
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET",this.ajaxUrl);
			xmlhttp.timeout = 2000; 
			xmlhttp.onreadystatechange = function () {
				if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
					var str = xmlhttp.responseText;
					that.loadStatus = true;
					clearTimeout(that.SETTIMER);
					try{
						var obj = JSON.parse(str);
						that.sucess(obj);  
						var assetLen = that.getCurPageAssetsLen();
						that.lostFocus();

						var pos = offset;
						if ( pos > that.getCurPageAssetsLen() -1 ) {
							pos = 0;
						}
						that.setCurLabelIndex(pos);
						that.onFocus();
						that.showUpOrLeftTag();
						if ( that.getCurPageNum() == that.getTotalPageNum() ) {
							that.hideDwonOrRightTag();
						} else if( that.getCurPageNum() == 1 ){
							that.hideUpOrLeftTag();
						} else {
							that.showUpOrLeftTag();
							that.showDwonOrRightTag();
						}
					} catch(err){
						var obj = null;
					}
				} else {
					that.setTotalPageNum(1);
					that.error();
				}
			}
			xmlhttp.send();
			
			this.SETTIMER = setTimeout(function(){
				//超时处理
				if ( that.loadStatus == false ) {
					xmlhttp.abort();
					that.loadStatus = true;//可以进行下次请求
				}
			},2000);
		}
	},
	//下页
	pageDown : function () {
		this.pageDownFun(this.getCurLabelIndex());
	},
	pageUpFun : function ( offset ) {
		var pageNum = this.getCurPageNum();
		if ( pageNum > 1 && this.loadStatus == true ) {
			this.setCurPageNum( pageNum - 1);
			this.setAjaxUrl();//重新设置ajaxUrl，准备发送请求
			console.log(" this.ajaxUrl " + this.ajaxUrl);
			//发送请求
			this.loadStatus = false;
			var xmlhttp;
			var that = this;
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET",this.ajaxUrl);
			xmlhttp.timeout = 2000; 
			xmlhttp.onreadystatechange = function () {
				if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
					var str = xmlhttp.responseText;
					that.loadStatus = true;
					clearTimeout(that.SETTIMER);
					try{
						var obj = JSON.parse(str);
						that.sucess(obj);
						that.lostFocus();
						var pos = offset;
						that.setCurLabelIndex(pos);
						that.onFocus();
						if ( that.getCurPageNum() == that.getTotalPageNum() ) {
							that.hideDwonOrRightTag();
						} else if( that.getCurPageNum() == 1 ){
							that.hideUpOrLeftTag();
						} else {
							that.showUpOrLeftTag();
							that.showDwonOrRightTag();
						}
					} catch(err){
						var obj = null;
					}
				} else {
					that.setTotalPageNum(1);
					that.error();
				}
			}
			xmlhttp.send();	
			
			this.SETTIMER = setTimeout(function(){
				//超时处理
				if ( that.loadStatus == false ) {
					xmlhttp.abort();
					that.loadStatus = true;//可以进行下次请求
				}
			},2000);
		}
	},
	//上页
	pageUp : function () {
		this.pageUpFun(this.getCurLabelIndex());
	},
	//数据加载区域上键处理函数
	keyUp : function () {  
		var index = this.getCurLabelIndex();
		var y = this.getStepMap()[1];
		var len = this.getCurPageAssetsLen();
		
		var upBorder =  this.borderMap.up;
		if ( this.getCurLabelIndex() - y < 0 ) {
			if ( upBorder == "Page" ) {
				if ( this.getCurPageNum() > 1 ) {
					this.navPosChange(-y);	
				}
			} else {
				this.navAreaChange(this.getAreaMapTop());
			}
		} else {
			this.navPosChange(-y);
		}
	},
	keyDown : function () {  
		var index = this.getCurLabelIndex();
		var y = this.getStepMap()[1];
		var len = this.getCurPageAssetsLen();
		
		var downBorder =  this.borderMap.down;
		
		if ( this.getCurLabelIndex() + y > this.getLabelObjs().length - 1 ) {
			if ( downBorder == "Page" ) {
				if ( this.getCurPageNum() < this.getTotalPageNum() ) {
					this.navPosChange(y);	
				}
			} else {
				this.navAreaChange(this.getAreaMapBottom());
			}
		} else {
			this.navPosChange(y);
		}
	},
	keyLeft : function () {  
		var index = this.getCurLabelIndex();
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var len = this.getCurPageAssetsLen();
		
		var leftBorder = this.borderMap.left;
		if ( x >= 1 ) {//多列
			if ( index % y == 0 ) {
				//左边界
				if ( leftBorder == "Page" ) {
					if ( this.getCurPageNum() > 1 ) {
						this.pageUpFun(this.getCurLabelIndex()+(y-1));
					} else if ( this.getCurPageNum() == 1 ) {
						this.navAreaChange(this.getAreaMapLeft());
					}
				} else {
					this.navAreaChange(this.getAreaMapLeft());
				}
			} else {
				this.navPosChange(-x);
			}
		} else if ( x == 0 ) {
			this.navAreaChange(this.getAreaMapLeft());
		}
	},
	keyRight : function () {  
		var index = this.getCurLabelIndex();
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var len = this.getCurPageAssetsLen();
		
		var rightBorder = this.borderMap.right;
		if ( x >= 1 ) {//多列
			if ( index % y == y - 1 || index == len - 1 ) {
				//左边界
				if ( rightBorder == "Page" ) {
					if ( this.getCurPageNum() < this.getTotalPageNum() ) {
						this.pageDownFun(this.getCurLabelIndex()-(y-1));
					}
				} else {
					this.navAreaChange(this.getAreaMapRight());
				}
			} else {
				this.navPosChange(x);
			}
		} else if ( x == 0 ) {
			this.navAreaChange(this.getAreaMapRight());
		}
	},
	keyEnter : function () {
		
	}
}
