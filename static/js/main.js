defaultImg = 'static/img/bg-img/personicon.svg';

function deleteFlash(button) {
	let element = button.closest('.flash-msg');
	element.classList.remove('opacity-100');
	element.classList.add('opacity-0');
	setTimeout(function() {
		element.remove();
	},300);
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

function closeStudentModal() {
	hideModal();

	let idNo = document.getElementById('idno');
	let lastName = document.getElementById('lastname');
	let firstName = document.getElementById('firstname');
	let courseName = document.getElementById('course');
	let courseLevel = document.getElementById('level');
	let qrCode = document.getElementById('qrcode');
	let imageSrc = document.getElementById('image');
	let imageUploadSrc = document.getElementById('image-upload');

	idNo.value = '';
	lastName.value = '';
	firstName.value = '';
	courseName.value = '';
	courseLevel.value = '';
	qrCode.src = defaultImg;
	imageSrc.src = defaultImg;
	imageUploadSrc.value = '';
	try {
		document.getElementById('webcam-result').querySelector('img').src = '';
	} catch (err) {
		console.log('Webcam inner html dont yet exist!    ', err)
	}

	console.log('idno  ', idNo)
	console.log('lastname      ', lastName)
	console.log('firstname  ', firstName)
	console.log('course  ', courseName)
	console.log('level  ', courseLevel)
	console.log('qr  ', qrCode)
	console.log('img  ', imageSrc)
	console.log('img-upload  ', imageUploadSrc)
}

function isFields() {
	const idNo = document.getElementById('idno').value;
	const lastName = document.getElementById('lastname').value;
	const firstName = document.getElementById('firstname').value;
	const courseName = document.getElementById('course').value;
	const courseLevel = document.getElementById('level').value;
	const imageSrc = document.getElementById('image').src;

	if (!idNo || !lastName || !firstName || !courseName || !courseLevel) {
		alert('Please fill in all the fields.');
		return false;
	} else if (imageSrc === defaultImg) {
		alert('Please pick an image or take a snapshot.');
		return false;
	} else {
		return true;
	}
}

function deleteStudent(button) {
	const idno = button.dataset.idno;
	console.log(idno)
	let input = document.getElementById('delete-student-input');
	input.value = idno;
}

function promptDelete() {
	return confirm('Are you sure you want to delete this student?')
}

function addStudent() {
	showModal();
	document.getElementById('edit-add-flag').value = 'add';
	console.log('EDIT ADD FLAG: ' + document.getElementById('edit-add-flag').value);

	document.getElementById('idno').readOnly = false;
	document.getElementById('image').src = defaultImg;
	document.getElementById('qrcode').src = defaultImg;
}

function editStudent(button) {
	showModal();
	document.getElementById('edit-add-flag').value = 'edit';
	console.log('EDIT ADD FLAG: ' + document.getElementById('edit-add-flag').value);

	const idno = button.dataset.idno;
	const lastname = button.dataset.lastname;
	const firstname = button.dataset.firstname;
	const course = button.dataset.course;
	const level = button.dataset.level;
	const qrcode = button.dataset.qrcode;
	const image = button.dataset.image;

	document.getElementById('idno').value = idno;
	document.getElementById('idno').readOnly = true;
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
	const flag = document.getElementById('edit-add-flag');
	console.log('EDIT ADD FLAG: ' + document.getElementById('edit-add-flag').value);

	let idNo = document.getElementById('idno').value;
	let lastName = document.getElementById('lastname').value;
	let firstName = document.getElementById('firstname').value;
	let courseName = document.getElementById('course').value;
	let courseLevel = document.getElementById('level').value;
	let qrCode = document.getElementById('qrcode').value;
	let imageSrc = document.getElementById('image').src;
	let imageUploadSrc = document.getElementById('image-upload').value;

	if (flag.value == "edit") {
		const idno = button.dataset.idno;
		const lastname = button.dataset.lastname;
		const firstname = button.dataset.firstname;
		const course = button.dataset.course;
		const level = button.dataset.level;
		const qrcode = button.dataset.qrcode;
		const image = button.dataset.image;
		idNo = idno;
		lastName = lastname;
		firstName = firstname;
		courseName = course;
		courseLevel = level;
		qrCode = qrcode;
		imageSrc = image;
		imageUploadSrc = '';
		try {
			document.getElementById('webcam-result').querySelector('img').src = '';
		} catch (err) {
			console.log('Webcam inner html dont yet exist!    ', err)
		}
	} else {
		idNo = '';
		lastName = '';
		firstName = '';
		courseName = '';
		courseLevel = '';
		qrCode = defaultImg;
		imageSrc = defaultImg;
		imageUploadSrc = '';
		try {
			document.getElementById('webcam-result').querySelector('img').src = '';
		} catch (err) {
			console.log('Webcam inner html dont yet exist!    ', err)
		}
	}

	console.log('idno  ', idNo)
	console.log('lastname      ', lastName)
	console.log('firstname  ', firstName)
	console.log('course  ', courseName)
	console.log('level  ', courseLevel)
	console.log('qr  ', qrCode)
	console.log('img  ', imageSrc)
	console.log('img-upload  ', imageUploadSrc)
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

function promptIfIdnoEmpty(event) {
	console.log('idno   ',document.getElementById('idno').value)
	if (document.getElementById('idno').value == '') {
		alert('Please state your id number first.')
		event.preventDefault();
		return;
	}
}

function displayImgUpload(input) {
	if (input.files && input.files[0]){
        try {
        	let reader = new FileReader();
	        reader.onload = function(e) {
	            document.getElementById('image').src = e.target.result;
	        }
        	reader.readAsDataURL(input.files[0]);
        } catch (err) {
        	console.log('eroeroe: ' + err)
        }
        createQRCode(document.getElementById('idno').value);
    } else {
		alert('No file selected.')
	}
}

// Wa koy nasabtan ani nga function !!
// All I know is that iya iconvert ang base64 image into FileStorage object ehehe
function base64ToFileStorageObject(imageBase64, filename, inputElement) {
	// const imageBase64 = document.getElementById('webcam-result').querySelector('img').src;
	const imageBase64Sliced = imageBase64.split(',')[1];
	try {
		const imageBinary = atob(imageBase64Sliced);
		const byteArray = new Uint8Array(imageBinary.length);
		for (let i=0; i<imageBinary.length; i++) {
			byteArray[i] = imageBinary.charCodeAt(i);
		}
		const blob = new Blob([byteArray], { type: 'image/jpg' });
		filename = filename + ".jpg";
		const file = new File([blob], filename, { type: 'image/jpg' });
		// const fileInput = document.getElementById('image-upload');
		const fileInput = inputElement;
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		fileInput.files = dataTransfer.files;
		fileInput.dispatchEvent(new Event("change"));
	} catch (err) {
		console.log(err)
	}
}

function isBase64(uri) {
	var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
	return base64regex.test(uri);
}

function createQRCode(idno) {
	var qr = qrcode(4, 'L');
	qr.addData(idno);
	qr.make();
	// In Base64 format
	let qrcodeDisplay = document.getElementById('qrcode');
	let qrcodeInput = document.getElementById('qrcode-upload');
	qrcodeDisplay.src = qr.createDataURL();

	console.log('snapshot qr', qrcodeDisplay.src);
	console.log('isBase64? ', isBase64(qrcodeDisplay.src.split(',')[1]));

	const filename = 'qrcode' + idno;
	base64ToFileStorageObject(qrcodeDisplay.src, filename, qrcodeInput);
	console.log('qrcode: ', qrcodeInput.value);
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
	document.getElementById('image').src = document.getElementById('webcam-result').querySelector('img').src;

	const idno = document.getElementById('idno').value;
	createQRCode(idno);
	
	console.log('attempting to upload snap...')
	let webcamResultElement = document.getElementById('webcam-result').querySelector('img');
	let webcamInputElement = document.getElementById('image-upload');
	base64ToFileStorageObject(webcamResultElement.src, "webcam_snapshot", webcamInputElement);	
	console.log('webcam: ', webcamInputElement.value);
}

function closeWebcam() {
	if (Webcam.live) {
		Webcam.reset()
	}
}
