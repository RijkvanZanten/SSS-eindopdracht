if(document.getElementById('edit_profile')) {
	document.getElementById('edit_profile').addEventListener('click', function() {
		document.querySelector('main > header').classList.add('hide');
		document.querySelector('main > form').classList.remove('hide');
	});
}