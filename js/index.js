$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	var windowScale=window.innerWidth/750;
	
	//----------------------------------------页面初始化----------------------------------------
	icom.init(init);//初始化
	icom.screenScrollUnable();//如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为
	
	function init(){
		requestAnimationFrame(function(){
			loadBox.show();
			iuser.init(userGetted);
//			load_handler();
		});
	}//edn func
	
	//----------------------------------------微信用户登录验证----------------------------------------	
	function userGetted(data){
		load_handler();
	}//end func
	
	//----------------------------------------加载页面图片----------------------------------------
	function load_handler(){
		var loader = new PxLoader();
		loader.addImage('images/share.jpg');
		loader.addImage('images/index/bg.jpg');
		loader.addImage('images/index/k.png');
		loader.addImage('images/index/ka.png');
		loader.addImage('images/edit/abtn.png');
		loader.addImage('images/edit/ar.png');
		loader.addImage('images/edit/bg1.jpg');
		loader.addImage('images/edit/bg2.jpg');
		loader.addImage('images/edit/bg3.jpg');
		loader.addImage('images/edit/cbtn.png');
		loader.addImage('images/edit/d.png');
		loader.addImage('images/edit/kuang1.png');
		loader.addImage('images/edit/kuang2.png');
		loader.addImage('images/edit/no.png');
		loader.addImage('images/edit/tips.png');
		loader.addImage('images/edit/title1.png');
		loader.addImage('images/edit/title2.png');
		loader.addImage('images/edit/u.png');
		loader.addImage('images/edit/w.png');
		loader.addImage('images/edit/wbtn.png');
		loader.addImage('images/edit/yes.png');
		loader.addImage('images/common/arL.png');
		loader.addImage('images/common/arR.png');
		loader.addImage('images/common/bgm_off.png');
		loader.addImage('images/common/bgm_on.png');
		loader.addImage('images/common/blank.png');
		loader.addImage('images/common/logo1.png');
		loader.addImage('images/common/logo2.png');
		loader.addImage('images/common/share.png');
		loader.addImage('images/common/turn_lock.png');
		loader.addImage('images/common/turn_no.png');
		loader.addImage('images/common/turn_phone.png');
		loader.addImage('images/common/turn_unlock.png');
		loader.addImage('images/common/turn_yes.png');
		loader.addImage('images/btns/1.png');
		loader.addImage('images/btns/2.png');
		loader.addImage('images/btns/3.png');
		loader.addImage('images/btns/4.png');
		loader.addImage('images/btns/5.png');
		
		loader.addCompletionListener(function() {
			init_handler();
			loader=null;
		});
		loader.start();	
	}//end func
	
	
	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler(){
		icom.fadeOut(loadBox,500);
		pageInit();
		monitor_handler();
	}//end func

	var formBox = $("section.formBox");
	var sloganBox = $("section.sloganBox");
	var photoBox = $("section.photoBox");
	var editBox = $("section.editBox");
	var resultBox = $("section.resultBox");
	var tipsBox = $("#tips");

	var nowPage = 0;
	var backFlag = false;
	var boxs = [formBox,sloganBox,photoBox,editBox,resultBox];
	var slogans = [];
	var icamera;
	var iFormInfo = {
		name:"",
		model:"",
		pro:"",
		year:"",
		slogan:"",
		img:""
	};

	//页面初始化
	function pageInit(){
		yearSelectInit();
		cameraInit();
		eventInit();
	}//end func

	//事件初始化
	function eventInit(){
		$(".backBtn").on("touchend",prevPage);

		formBox.find('.option').on("touchend",choseProduct);
		formBox.find('.ContinueBtn').on("touchend",vefForm);
		// $("#slogan").on("input",makeSlogan);
		sloganBox.find('.changeBtn').on("touchend",changeSlogan);
		sloganBox.find('.ContinueBtn').on("touchend",getSlogan);
		photoBox.find('.ContinueBtn').on("touchend",showTips);
		tipsBox.find('.no').on("touchend",function(){icom.fadeOut(tipsBox)});
		tipsBox.find('.yes').on("touchend",addPhotoFrame);		
		editBox.find(".againBtn").on("touchend",choseAgain);
		resultBox.find(".againBtn").on("touchend",function(){location.reload()});
		editBox.find('.okBtn').on("touchend",makePoster);
	}//end func

	//生成海报
	function makePoster(){
		var opts = {
			secretkey:"jiadeshi",
			callback:showResult
		}
		icamera.canvasTrfImg(opts);
	}//end func

	//显示结果
	function showResult(src){
		resultBox.find('.show')[0].src = src;
		resultBox.find('.down')[0].src = src;
		icom.fadeOut(editBox);
		icom.fadeIn(resultBox);
	}//end func

	//重新选择
	function choseAgain(){
		backFlag = false;
		photoBox.find('.previewBox').hide();
		photoBox.find('.arRBtn').hide();
		icom.fadeIn(photoBox,500,function(){
			editBox.addClass('hide');
		});
	}//end func

	//合成初始化
	function cameraInit(){
		icamera = new camera();
		var options = {
			scale:3,
			filter:false,
			loadBox:loadBox,
			cameraBtn:$("#cameraBtn"),
			onUpload:previewImg
		}
		icamera.init($("#photoContainer"),options);
	}//end func

	//显示提示
	function showTips(){
		if(iFormInfo.img == "") icom.alert("请上传您的照片");
		else icom.fadeIn(tipsBox);
	}//end func

	//添加相框
	function addPhotoFrame(){
		creatFrame();
		var word = countSloganSize();
		creatSlogan(word);
		icamera.setBaseEvent(0.5,3);
		editBox.removeClass('hide');
		icom.fadeOut(photoBox);
		icom.fadeOut(tipsBox);
	}//end func

	//计算标语字体大小
	function countSloganSize(){
		var word = {
			size:0.7,
			num:5
		};
		var deviation = Math.ceil(iFormInfo.slogan.length / 10) - 1;
		word.size += deviation*0.1375;
		word.num += deviation;
		return word;
	}//end func

	//创建标语
	function creatSlogan(word){
		var nameBox = $(".sloganDemo .name");
		var nameopts = {
			color:"#fff",
			x:delPX(nameBox.css('left'))/2 - delPX(nameBox.css('fontSize'))/1.7 * (iFormInfo.name.length - 1),
			y:delPX(nameBox.css('top'))/2,
			fontSize:delPX(nameBox.css('fontSize'))/1.7,
			lineHeight:1.2
		};
		icamera.addTextLayer("name",iFormInfo.name,nameopts);

		var titileBox = $(".sloganDemo .title");
		var titleopts = {
			color:"#fff",
			x:delPX(titileBox.css('left'))/2,
			y:delPX(titileBox.css('top'))/2,
			fontSize:delPX(titileBox.css('fontSize'))/1.7,
			lineHeight:1.2
		};
		icamera.addTextLayer("title","自"+iFormInfo.year+"年使用加德士产品",titleopts);

		var wordBox = $(".sloganDemo .word");
		var sloganopts = {
			color:"#fff",
			x:delPX(wordBox.css('left'))/2,
			y:delPX(wordBox.css('top'))/2,
			fontSize:delPX(wordBox.css('fontSize'))/word.size,
			lineHeight:1.3,
			maxNum:word.num
		};
		icamera.addTextLayer("slogan",iFormInfo.slogan,sloganopts);

		//去掉单位
		function delPX(str){
			return parseInt(str.split("px")[0])
		}//end func
	}//end func

	//创建相框
	function creatFrame(){
		var canvas = icamera.photoCanvas;

		var opts = {
			src:"images/edit/kuang"+iFormInfo.pro+".png",
			index:999,
			intangible: true
		}

		icamera.img_creat("frame",canvas,opts);
	}//end func

	//预览图片
	function previewImg(src){
		iFormInfo.img = src;
		$(".previewBox").show().html('<img src="'+src+'">');
		photoBox.find('.arRBtn').show();
		backFlag = true;
	}//end func

	//获取标语
	function getSlogan(){
		iFormInfo.slogan = $('#slogan').val();
		photoBox.find('.name').html(iFormInfo.name+" 自"+iFormInfo.year+"年使用加德士产品");
		photoBox.find('.word').html(iFormInfo.slogan);
		nextPage();
	}//end func

	//修改标语
	function makeSlogan(){
		sloganBox.find('.word').html($("#slogan").val());
	}//end func

	//变换标语
	function changeSlogan(){
		var i = imath.randomRange(0,slogans.length - 1);
		$('#slogan').val(slogans[i]);
	}//end func

	//验证表单
	function vefForm(){
		iFormInfo.name = $("#name").val();
		iFormInfo.model = $("#pro").val();
		iFormInfo.year = $("#year").val();

		if(iFormInfo.name == "") icom.alert("请输入您的姓名！");
		else if(iFormInfo.model == "") icom.alert("请输入您的车型或设备！");
		else if(iFormInfo.pro == "") icom.alert("请选择您使用的加德士产品！");
		else if(iFormInfo.year == "") icom.alert("请选择从何时开始使用此款产品！");
		else {
			slogans = wordData[iFormInfo.pro];
			changeSlogan();
			icamera.userName = iFormInfo.name;
			icamera.userPro = iFormInfo.pro == "1" ? "德乐" : "金富力";
			nextPage();
			submitInfo();
		}
	}//end func

	//上一页
	function prevPage(){
		if(backFlag){
			icom.fadeOut(photoBox.find('.previewBox'));
			icom.fadeOut(photoBox.find('.arRBtn'));
			backFlag = false;
		}
		else if(nowPage > 0){
			icom.fadeOut(boxs[nowPage]);
			icom.fadeIn(boxs[nowPage-1]);
			nowPage--;
		}
	}//end func

	//下一页
	function nextPage(){
		if(nowPage < 5){
			icom.fadeOut(boxs[nowPage]);
			icom.fadeIn(boxs[nowPage+1]);
			nowPage++;
		}
	}//end func

	//提交信息 AJAX
	function submitInfo(){
		console.log(iFormInfo)
	}//end func

	//选择产品
	function choseProduct(){
		formBox.find('.option').removeClass('active');
		$(this).addClass('active');
		iFormInfo.pro = $(this).attr('data-val');
	}//end func

	//年份选择初始化
	function yearSelectInit(){
		var cont = "";
		for (var i = 2018; i > 1990; i--) {
			cont += '<option value="'+i+'">'+i+'年</option>'
		}
		$("#year").append(cont);
	}//end func
	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
		imonitor.add({obj:$('.ContinueBtn'),action:'touchstart',category:'default',label:'继续'});
		imonitor.add({obj:$('.backBtn'),action:'touchstart',category:'default',label:'返回'});
		imonitor.add({obj:$('.changeBtn'),action:'touchstart',category:'default',label:'变更感言'});
		imonitor.add({obj:$('#cameraBtn'),action:'touchstart',category:'default',label:'上传照片'});
		imonitor.add({obj:$('.yes'),action:'touchstart',category:'default',label:'同意'});
		imonitor.add({obj:$('.no'),action:'touchstart',category:'default',label:'不同意'});
		imonitor.add({obj:$('.againBtn'),action:'touchstart',category:'default',label:'重新选择'});
		imonitor.add({obj:$('.okBtn'),action:'touchstart',category:'default',label:'生成海报'});
	}//end func
});//end ready
