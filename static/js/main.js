defaultImg = 'static/img/bg-img/personicon.svg';

function deleteFlash(index) {
	let element = document.getElementsByClassName('flash-msg')[index];
	element.classList.remove('opacity-100');
	element.classList.add('opacity-0');
	setTimeout(function() {
		element.remove();
	},1000);
}

function dropMenu() {
	let headerBtn = document.getElementById('header-dropdown');
	let headerBtnFlag = document.getElementById('dropdown-flag');
	let dropdown = document.getElementById('settings-dropdown');

	headerBtnFlag.checked = !headerBtnFlag.checked;

	if (headerBtnFlag.checked) {
		dropdown.classList.remove('hidden')

		setTimeout( function() {
			dropdown.classList.remove('-translate-y-10');
			dropdown.classList.remove('opacity-0');
			dropdown.classList.add('translate-y-0');
			dropdown.classList.add('opacity-100');
		}, 100)
	} else {
		dropdown.classList.remove('translate-y-0');
		dropdown.classList.remove('opacity-100');
		dropdown.classList.add('-translate-y-10');
		dropdown.classList.add('opacity-0');

		setTimeout( function() {
			dropdown.classList.add('hidden')
		}, 600)
	}
}

function editStudent(button) {
	showModal();

	const idno = button.dataset.idno;
	const lastname = button.dataset.lastname;
	const firstname = button.dataset.firstname;
	const course = button.dataset.course;
	const level = button.dataset.level;
	const qrcode = button.dataset.qrcode;
	const image = button.dataset.image;

	document.getElementById('idno').value = idno;
	document.getElementById('lastname').value = lastname;
	document.getElementById('firstname').value = firstname;
	document.getElementById('course').value = course;
	document.getElementById('level').value = level;
	document.getElementById('qrcode').src = qrcode;
	document.getElementById('image').src = image;
	
	if (qrcode == 'None') {
		document.getElementById('qrcode').src = defaultImg;
	} 

	if (image == 'None') {
		document.getElementById('image').src = defaultImg;
	}
}

function toggleEditImage() {
	let editFlag = document.getElementById('modal-edit-flag');
	let cameraBtn = document.getElementById('camera-button');

	if (!editFlag.checked) {
		document.getElementById('modal-hide-when-edit').classList.add('hidden');
		document.getElementById('modal-show-when-edit').classList.remove('hidden');
		cameraBtn.classList.remove('hidden');
		Webcam.attach( '#webcam' );
		setWebcam();
	} else {
		document.getElementById('modal-hide-when-edit').classList.remove('hidden');
		document.getElementById('modal-show-when-edit').classList.add('hidden');
		cameraBtn.classList.add('hidden');
		closeWebcam();
	}

	editFlag.checked = !editFlag.checked;
}

function cancelData(button) {
	const idno = button.dataset.idno;
	const lastname = button.dataset.lastname;
	const firstname = button.dataset.firstname;
	const course = button.dataset.course;
	const level = button.dataset.level;
	const qrcode = button.dataset.qrcode;
	const image = button.dataset.image;

	document.getElementById('idno').value = idno;
	document.getElementById('lastname').value = lastname;
	document.getElementById('firstname').value = firstname;
	document.getElementById('course').value = course;
	document.getElementById('level').value = level;
	document.getElementById('qrcode').value = qrcode;
	document.getElementById('image').src = image;
	document.getElementById('image-upload').value = '';
	document.getElementById('webcam-result').querySelector('img').src = '';
}

function showModal() {
	let modal = document.getElementById('student-modal');
	let modalCard = document.getElementById('student-modal-card');

	modal.classList.remove('hidden');

	// Delay starting transitions by a bit after removing 'hidden' so
	// that we can be assured these transitions can load.
	setTimeout( function() {
		modal.classList.remove('bg-black/0');
		modal.classList.add('bg-black/40');
		modalCard.classList.remove('opacity-0');
		modalCard.classList.remove('translate-y-3/4');
		modalCard.classList.add('opacity-100');
		modalCard.classList.add('translate-y-0');
	}, 100);
}

function hideModal() {
	let modal = document.getElementById('student-modal');
	let modalCard = document.getElementById('student-modal-card');

	modal.classList.remove('bg-black/40');
	modal.classList.add('bg-black/0');
	modalCard.classList.remove('translate-y-0');
	modalCard.classList.remove('opacity-100');
	modalCard.classList.add('translate-y-3/4');
	modalCard.classList.add('opacity-0');

	setTimeout( function() {
		modal.classList.add('hidden');
	}, 600);

	closeWebcam();
}

function showTooltip(tooltipId) {
    let tooltip = document.getElementById(tooltipId);
    tooltip.classList.remove('hidden');
    setTimeout(() => {
        tooltip.classList.remove('opacity-0');
        tooltip.classList.add('opacity-100');
    }, 0);
}

function hideTooltip(tooltipId) {
    let tooltip = document.getElementById(tooltipId);
    tooltip.classList.remove('opacity-100');
    tooltip.classList.add('opacity-0');
    setTimeout(() => {
        tooltip.classList.add('hidden');
    }, 300);
}

function displayImgUpload(input) {
	if(input.files && input.files[0]){
        try {
        	let reader = new FileReader();
	        reader.onload = function(e) {
	            document.getElementById('image').src = e.target.result;
	        }
        	reader.readAsDataURL(input.files[0]);
        } catch (err) {
        	console.log('eroeroe: ' + err)
        }
    } else {
		alert('No file selected.')
	}
}

const webcamContainer = document.getElementById('webcam');

function setWebcam() {
	var height = webcamContainer.offsetHeight;
	var width = webcamContainer.offsetWidth;
	console.log("w: " + width)
	console.log("h: " + height)
	Webcam.set({
		width: width,
		height: height
	})
}

function takeSnapshot() {
	Webcam.snap( function(data_uri) {
		document.getElementById('webcam-result').innerHTML = '<img src="' + data_uri + '"/>';
	})
}

// Wa koy nasabtan ani nga function !!
// All I know is that iya iconvert ang base64 image into FileStorage object ehehe
function uploadSnapshot() {
	const isCamera = document.getElementById('modal-edit-flag');

	if (isCamera.checked) {
		console.log('attempting to upload snap...')
		// const image = document.getElementById('webcam-result').querySelector('img').src;
		// let postImageElement = document.getElementById('image-form-submit');
		// postImageElement.value = image;
		const imageBase64 = document.getElementById('webcam-result').querySelector('img').src;
		const imageBase64Sliced = imageBase64.split(',')[1];
		try {
			const imageBinary = atob(imageBase64Sliced);
			const byteArray = new Uint8Array(imageBinary.length);
			for (let i=0; i<imageBinary.length; i++) {
				byteArray[i] = imageBinary.charCodeAt(i);
			}
			const blob = new Blob([byteArray], { type: 'image/jpg' });
			const file = new File([blob], "webcam_snapshot.jpg", { type: 'image/jpg' });
			const fileInput = document.getElementById('image-upload');
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			fileInput.files = dataTransfer.files;
			fileInput.dispatchEvent(new Event("change"));
		} catch (err) {
			console.log(err)
		}
	}
}

function closeWebcam() {
	if (Webcam.live) {
		Webcam.reset()
	}
}
