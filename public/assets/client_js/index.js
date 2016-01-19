// Realtime gekkigheid
var socket = io.connect('/');

socket.on('comment', function (data) {
	console.log(data);
    var photo = document.querySelector('article[data-photoid="' + data.photoid + '"]');
    var commentsList = photo.querySelectorAll('.comments')[0];
    
    if(!data.username) {
	    commentsList.innerHTML += '<li class="no_acc">' + data.comment + '</li>';
    } else {
	    commentsList.innerHTML += '<li><a href="/explore/user/' + data.username + '">' + data.username + '</a> ' + data.comment + '</li>';
    }
});

socket.on('photo', function(data) {
	console.log(data);
});

// Insert comment into DB
function insertComment(photoid, userid, comment) {
	var request = new XMLHttpRequest();
	
	request.open('POST', '/ajax/insert');
	
	if(!userid) {
		userid = null;
	}
	
	var data = {
		photoid: photoid,
		comment: comment,
		userid: userid
	}
	
	var photo = document.querySelector('[data-photoid="' + photoid + '"]');
	var commentsList = photo.querySelectorAll('.comments')[0];
	
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	request.send(JSON.stringify(data));
	
	request.addEventListener('load', function(){
		var comments = JSON.parse(this.responseText);
		
		commentsList.innerHTML = '';
		
		for(i = 0; i < comments.length; i++) {
			if(!comments[i].username){
				commentsList.innerHTML += '<li class="no_acc">' + comments[i].comment + '</li>';
			} else {
				commentsList.innerHTML += '<li><a href="/explore/user/' + comments[i].username + '">' + comments[i].username + '</a> ' + comments[i].comment + '</li>';
			}
		}
	});
}

var forms = document.querySelectorAll('.photo form');

for(i = 0; i < forms.length; i++) {
	forms[i].addEventListener('submit', function(e){
		e.preventDefault();
		
		var photoid = this.querySelectorAll('input[type=hidden]')[0].value;
		var userid = this.querySelectorAll('input[type=hidden]')[1].value;
		var username = this.querySelectorAll('input[type=hidden]')[2].value;
		var comment = this.querySelector('input[type=text]').value;
		
		
		insertComment(photoid, userid, comment);
		
		socket.emit('new comment', {photoid: photoid, username: username, comment: comment});
		
		this.querySelector('input[type=text]').value = '';
		
		return false;
	});
}

