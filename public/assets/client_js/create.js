function showImage(input) {
	if(input.files && input.files[0]) {

		if(input.files[0].type == 'image/jpeg' || input.files[0].type == 'image/png') {
			var reader = new FileReader();
		
			reader.addEventListener('load', function(event){
				document.getElementById('profile_pic_preview').setAttribute('src', event.target.result);
			});
			
			reader.readAsDataURL(input.files[0]);
		} else {
			alert('Geupload bestand wordt niet ondersteund.');
		}

	}
}

document.querySelector('input[name="profile_pic"]').addEventListener('change', function(){
	showImage(this);
});