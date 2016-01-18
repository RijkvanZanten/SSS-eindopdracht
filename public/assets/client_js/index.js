// Insert comment into DB
function insertComment(photoid, comment) {
	var request = new XMLHttpRequest();
	
	request.open('POST', '/ajax/insert');
	
	var data = {
		photoid: photoid,
		comment: comment
	}
	
	var photo = document.querySelector('[data-photoid="' + photoid + '"]');
	var commentsList = photo.querySelectorAll('.comments')[0];
	
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	request.send(JSON.stringify(data));
	
	request.addEventListener('load', function(){
		var comments = JSON.parse(this.responseText);

		for(i = 0; i < comments.length; i++) {
			commentsList.innerHTML += '<li><a href="/explore/user/' + comments[i].username + '">' + comments[i].username + '</a> ' + comments[i].comment + '</li>';
		}
	});
}

var forms = document.querySelectorAll('.photo form');

for(i = 0; i < forms.length; i++) {
	forms[i].addEventListener('submit', function(e){
		e.preventDefault();
		
		insertComment(this.querySelector('input[type=hidden]').value, this.querySelector('input[type=text]').value);
		
		this.querySelector('input[type=text]').value = '';
		
		return false;
	});
}

