/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish;
	var valueOf;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "ui_window";
	this.tests = [
		{name: "removeChildren", timeout: 10000},
		{name: "parentwindowFocus"},
		{name: "closeEventHW"},
		{name: "openHW"},
		{name: "numberOfFireCloseEvent"},
		{name: "windowPropertyOfTab"},
		{name: "numberOfOpenEventFire"},
		{name: "closeMethodInOpenEvent"},
		{name: "postLayoutEventInParentView"},
		{name: "barimageForNavbar"},
		{name: "openEventOfNormalwindow"}
	];

	//TIMOB-9100
	this.removeChildren = function(testRun){
		var win = Ti.UI.createWindow({
			width: 100,
			height: 100
		});
		var view = Ti.UI.createView();
		win.add(view);
		win.addEventListener('focus',function(){
			valueOf(testRun, win.children.length).shouldBe(1);
			valueOf(testRun,function(){
				win.remove(win.children[0]);
			}).shouldNotThrowException();

			finish(testRun);
		});
		win.open();
	}

	//TIMOB-8976 , TIMOB-9262 , TIMOB-9483
	this.parentwindowFocus = function(testRun) {
		var win1 = Titanium.UI.createWindow();
		var firstWinFocusEvent = 0;
		var firstWinBlurEvent = 0;
		var secondWinBlurEvent = 0;
		var secondWinFocusEvent = 0;
		var tabGroup = Titanium.UI.createTabGroup();
		var tab1 = Titanium.UI.createTab({  
			window:win1
		});
		tabGroup.addTab(tab1); 
		win1.addEventListener('focus', function(){
			firstWinFocusEvent += 1;
			if(firstWinFocusEvent == 1){
				win2.open();
				win2.close();
			}
			else{
				valueOf(testRun, firstWinFocusEvent).shouldBe(2);
				valueOf(testRun, secondWinFocusEvent).shouldBe(1);
				valueOf(testRun, firstWinBlurEvent).shouldBe(1);
				valueOf(testRun, secondWinBlurEvent).shouldBe(1);

				finish(testRun);
			}
		});
		win1.addEventListener('blur', function(){
			firstWinBlurEvent += 1;
		}); 
		var win2 = Ti.UI.createWindow();
		win2.addEventListener('focus', function(){
			secondWinFocusEvent += 1;
		});
		win2.addEventListener('blur', function(){
			secondWinBlurEvent +=1;
		}); 
		tabGroup.open();
	}

	//TIMOB-4947
	this.closeEventHW = function(testRun) {
		var win = Ti.UI.createWindow();
		var win2 = Ti.UI.createWindow({
			modal: true,
			backgroundColor: 'red'
		});
		win.addEventListener('open', function(){
			win2.open();
			setTimeout(function(){
				win2.close();
			},1000)
		});
		win2.addEventListener('close', function(){
			
			finish(testRun);
		});
		win.open();
	}

	//TIMOB-4759
	this.openHW = function(testRun){
		var win = Ti.UI.createWindow({
			modal: true,
			layout: 'vertical'
		});
		win.open();
		valueOf(testRun, function(){
			win.open();
		}).shouldNotThrowException();
		
		finish(testRun);
	}

	//TIMOB-1827
	this.numberOfFireCloseEvent = function(testRun) {
		var tabGroup = Titanium.UI.createTabGroup();
		var win1 = Titanium.UI.createWindow();
		var tab1 = Titanium.UI.createTab({  
			window: win1
		});
		tabGroup.addTab(tab1);
		var closecount = 0;
		win1.addEventListener('open', function() {
			var win = Ti.UI.createWindow({
				fullscreen: true,
				layout: 'vertical'
			});
			win.open();
			valueOf(testRun,win.fullscreen).shouldBeTrue();
			valueOf(testRun, win.layout).shouldBe('vertical');
			setTimeout(function(){
				win.close();
			},500);
			win.addEventListener('close', function() {
				closecount += 1;
			});
			setTimeout(function(){
				valueOf(testRun, closecount).shouldBe(1);
				
				finish(testRun);
			},3000)
		}); 
		tabGroup.open();
	}

	//TIMOB-6891
	this.windowPropertyOfTab = function(testRun){
		valueOf(testRun, function(){
			Ti.UI.createTab({window: Ti.UI.createWindow()}).
			window.addEventListener("focus", function(){});
		}).shouldNotThrowException();

		finish(testRun);
	}

	//TIMOB-8030
	this.numberOfOpenEventFire = function(testRun){
		var win = Ti.UI.createWindow({
			top: 10,
			right: 0,
			bottom: 10,
			left: 0,
		});
		var num = 0;
		win.addEventListener('open', function() {
			num += 1;
			valueOf(testRun, win.top).shouldBe(50);
			valueOf(testRun, win.bottom).shouldBe(50);
		});
		setTimeout(function(){
			valueOf(testRun, num).shouldBe(1);
			
			finish(testRun);
		},1000);
		win.top = 50;
		win.bottom = 50;
		win.open({
			top: 50,
			bottom: 50,
			duration: 0
		});
	}

	//TIMOB-9387
	this.closeMethodInOpenEvent = function(testRun){
		var win = Ti.UI.createWindow({  
			exitOnClose: true,
			navBarHidden: false
		});
		win.addEventListener('open', function(){
			valueOf(testRun, win.exitOnClose).shouldBe(1);
			valueOf(testRun, win.navBarHidden).shouldBe(0);
			win.close();
		});
		win.addEventListener('close', function(){
			
			finish(testRun);
		});
		win.open();
	}

	//TIMOB-10136
	this.postLayoutEventInParentView = function(testRun){
		var win = Ti.UI.createWindow({
			layout: 'vertical',
			navBarHidden: true
		});
		var view = Ti.UI.createView({
			width: 200,
			height: 200
		});
		win.add(view);
		var viewEvent = 0;
		var winEvent = 0;
		view.addEventListener('postlayout', function(){
			viewEvent += 1; 
		});
		win.addEventListener('postlayout', function() {
			winEvent += 1;
		});
		setTimeout(function(){
			valueOf(testRun,viewEvent).shouldBe(2);
			valueOf(testRun,winEvent).shouldBe(1);
			
			finish(testRun);
		},3000)
		win.open();
	}

	//TIMOB-5047
	this.barimageForNavbar = function(testRun){
		var tabGroup = Titanium.UI.createTabGroup();
		var win1 = Titanium.UI.createWindow({  
			height: 100,
			width: 100
		});
		var tab1 = Titanium.UI.createTab({  
			window:win1
		});
		tabGroup.addTab(tab1);  
		tabGroup.addEventListener('focus', function(){
			valueOf(testRun, function(){
				win1.setBarImage('/suites/ui_window/gradient.png');
			}).shouldNotThrowException();
			valueOf(testRun, win1.height).shouldBe(100);
			valueOf(testRun, win1.width).shouldBe(100);
			
			finish(testRun);
		});
		tabGroup.open();
	}

	//TIMOB-7569
	this.openEventOfNormalwindow = function(testRun){
		var modalwindow = Ti.UI.createWindow({
			backgroundColor:'red',
			modal: true,
		});
		var normalwindowCount = 0;
		var normalwindow = Ti.UI.createWindow();
		var win = Ti.UI.createWindow({
			height: 100,
			width: 100,
			backgroundColor: 'green'
		});
		win.addEventListener('open', function(){
			modalwindow.open();
			normalwindow.open();
			normalwindow.close();
			modalwindow.close();  
		});
		normalwindow.addEventListener('open', function(){
			normalwindowCount += 1;
		});
		setTimeout(function(){
			valueOf(testRun, win.height).shouldBe(100);
			valueOf(testRun,win.width).shouldBe(100);
			valueOf(testRun, normalwindowCount).shouldBe(1);
			
			finish(testRun);
		},3000);
		win.open();
	}
}