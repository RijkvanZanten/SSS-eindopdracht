var errorMessage = document.getElementById('upload_error');

function showImage(input) {
	if(input.files && input.files[0]) {

		if(input.files[0].type == 'image/jpeg' || input.files[0].type == 'image/png') {
			var reader = new FileReader();
		
			reader.addEventListener('load', function(event){
				document.getElementById('upload_preview').setAttribute('src', event.target.result);
			});
			
			reader.readAsDataURL(input.files[0]);
			
			errorMessage.classList.remove('active');
		} else {
			errorMessage.innerHTML = 'Geupload bestand wordt niet ondersteund.';
			errorMessage.classList.add('active');
		}

	}
}

document.querySelector('input[name="photo"]').addEventListener('change', function(){
	showImage(this);
});

document.querySelector('input[type=submit]').addEventListener('click', function(e) {
	if(!document.querySelector('input[name="photo"]').files[0]) {
		errorMessage.innerHTML = 'Geen bestand geupload.';
		errorMessage.classList.add('active');
		e.preventDefault();
		return false;
	}
});