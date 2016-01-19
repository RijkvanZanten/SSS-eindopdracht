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
		
		insertComment(this.querySelectorAll('input[type=hidden]')[0].value, this.querySelectorAll('input[type=hidden]')[1].value, this.querySelector('input[type=text]').value);
		
		this.querySelector('input[type=text]').value = '';
		
		return false;
	});
}

