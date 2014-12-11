$(function(){
	App.controller('home', function(page){

	});
	App.controller('page2', function(page){

	});
	try{
		App.restore();
	}catch(error){
		App.load('home');
	}

})
