const defaultImg = 'static/img/bg-img/personicon.svg';
let modalIdNo = '';		// updated within editStudent()

function deleteFlash(button) {
	let element = button.closest('.flash-msg');
	element.classList.remove('opacity-100');
	element.classList.add('opacity-0');
	setTimeout(function() {
		element.remove();
	},300);
}

function handleLoginSubmit() {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	if (username == '' || password == '') {
		alert('Please fill in all fields.');
		return false;
	} else {
		handleRememberMeCheck();
		return true;
	}
}

let time = new Date();
let timestamp_year = '';
let timestamp_month = '';
let timestamp_day = '';
let timestamp_hr = '';
let timestamp_mins = '';
let timestamp_secs = '';
let timestamp_date = '';
let timestamp_time = '';

// timestamp
setInterval( function() {
	time.setTime(time.getTime() + 1000);
	timestamp_year = time.getFullYear();
	timestamp_month = String(time.getMonth() + 1).padStart(2,'0');
	timestamp_day = String(time.getDate()).padStart(2,'0');
	timestamp_hr = String(time.getHours()).padStart(2, '0');
	timestamp_mins = String(time.getMinutes()).padStart(2, '0');
	timestamp_secs = String(time.getSeconds()).padStart(2,'0');
	timestamp_date = `${timestamp_year}/${timestamp_month}/${timestamp_day}`;
	timestamp_time = `${timestamp_hr}:${timestamp_mins}:${timestamp_secs}`;
	
	let element = document.getElementById('timestamp');
	element.textContent = `${timestamp_date} ${timestamp_time} Philippine Standard Time`;
	
}, 1000);

addEventListener('onload', updateTimestamp());

function updateTimestamp() {
	time = new Date();
	console.log(timestamp_date);
	console.log(timestamp_time);
}

function attendanceIsFields() {
	const idNo = document.getElementById('attendance-idno').value;
	const lastName = document.getElementById('attendance-lastname').value;
	const firstName = document.getElementById('attendance-firstname').value;
	const courseName = document.getElementById('attendance-course').value;
	const courseLevel = document.getElementById('attendance-level').value;
	const imageName = document.getElementById('attendance-info-image').src;
	const qrCode = document.getElementById('attendance-info-qrcode').src;
	if (!idNo || !lastName || !firstName || !courseName || !courseLevel || imageName == defaultImg || qrCode == defaultImg) {
		alert('Please scan a QRCode first.');
		return false;
	} else {
		return true;
	}
}

function submitAttendance() {
	if (attendanceIsFields()) {
		updateTimestamp();
		const date = timestamp_date;
		const time = timestamp_time;
		const idno = document.getElementById('attendance-idno').value;
		const kwargs = { idno:idno, date_logged:date, time_logged:time };
		postData(add_attendance_path, kwargs);
	}
}

function markAttendance() {
	openAttendanceModal();
	let qrCode = document.getElementById('attendance-info-qrcode');
	let image = document.getElementById('attendance-info-image');

	qrCode.src = defaultImg;
	image.src = defaultImg;
	openQrcodeScanner();
}

function openAttendanceModal() {
	let modal = document.getElementById('attendance-modal');
	let modalCard = document.getElementById('attendance-modal-card');
	showModal(modal, modalCard);
}

function closeAttendanceModal() {
	let modal = document.getElementById('attendance-modal');
	let modalCard = document.getElementById('attendance-modal-card');
	hideModal(modal, modalCard);
	setTimeout( function() {
		closeQrcodeScanner();
		gotoAttendanceQRCodeSection();
	}, 2000);
}

function postAttendance(idno) {
	const kwargs = {time_logged:timestamp_time, date_logged:timestamp_date, idno:idno}
	postData(add_attendance_path, kwargs);
}

function gotoAttendanceQRCodeSection() {
	let qrCodeSection = document.getElementById('attendance-qrcode-section');
	let infoSection = document.getElementById('attendance-info-section');

	qrCodeSection.classList.remove('hidden');
	infoSection.classList.add('hidden');

	openQrcodeScanner();
}

function gotoAttendanceInfoSection() {
	let qrCodeSection = document.getElementById('attendance-qrcode-section');
	let infoSection = document.getElementById('attendance-info-section');

	qrCodeSection.classList.add('hidden');
	infoSection.classList.remove('hidden');

	closeQrcodeScanner();
}

let scanner = null;

function openQrcodeScanner() {
	scanner = new Html5QrcodeScanner('qrcode-reader', {
		qrbox: {
			width: 350,
			height: 250,
		},
		fps: 20,
	
	})
	scanner.render(success);
}

function closeQrcodeScanner() {
	scanner.clear();
}

function success(result) {
	alert(`Scanning success! IDNO=${result}`);
	scanner.clear();
	gotoAttendanceInfoSection();
	let idnoElement = document.getElementById('get-student-form-idno');
	let idnoForm = document.getElementById('get-student-form');
	idnoElement.value = result;
	idnoForm.dispatchEvent(new Event('submit'));
}

document.getElementById('get-student-form').addEventListener('submit', async function(e) {
	e.preventDefault();

	const idno = document.getElementById('get-student-form-idno').value;

	try {
		const response = await fetch('/get_student', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `idno=${encodeURIComponent(idno)}`
		});
		console.log(response);
		const data = await response.json();
		let idNo = document.getElementById('attendance-idno');
		let lastName = document.getElementById('attendance-lastname');
		let firstName = document.getElementById('attendance-firstname');
		let courseName = document.getElementById('attendance-course');
		let courseLevel = document.getElementById('attendance-level');
		let imageName = document.getElementById('attendance-info-image');
		let qrCode = document.getElementById('attendance-info-qrcode');
		idNo.value = data.idno;
		lastName.value = data.lastname;
		firstName.value = data.firstname;
		courseName.value = data.course;
		courseLevel.value = data.level;
		imageName.src = data.image;
		qrCode.src = data.qrcode;

		console.log(data);

	} catch (error) {
		console.log(error);
	}
})

// login remember me
addEventListener('load', function() {
	if (window.location.pathname === index_path) {
		const rememberedUsername = localStorage.getItem('rememberedUsername');
		const rememberedPassword = localStorage.getItem('rememberedPassword');
		document.getElementById('username').value = rememberedUsername;
		document.getElementById('password').value = rememberedPassword;
		console.log(rememberedUsername, rememberedPassword);
	}
})

function handleRememberMeCheck() {
	let check = document.getElementById('remember-check');
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	if (check.checked) {
		localStorage.setItem('rememberedUsername', username);
		localStorage.setItem('rememberedPassword', password);
	}
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
	let modal = document.getElementById('student-modal');
	let modalCard = document.getElementById('student-modal-card');
	hideModal(modal, modalCard);

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
	imageUploadSrc.value = '';
	try {
		document.getElementById('webcam-result').querySelector('img').src = '';
	} catch (err) {
		console.log('Webcam inner html dont yet exist!')
	}

	setTimeout( function() {
		qrCode.src = defaultImg;
		imageSrc.src = defaultImg;
	}, 1000);
}

function isFields() {
	const idNo = document.getElementById('idno').value;
	const lastName = document.getElementById('lastname').value;
	const firstName = document.getElementById('firstname').value;
	const courseName = document.getElementById('course').value;
	const courseLevel = document.getElementById('level').value;
	const temp_img = document.getElementById('image').src;
	const imageSrc = substringer(temp_img, 'static/img');

	console.log(imageSrc, defaultImg);
	
	if (!idNo || !lastName || !firstName || !courseName || !courseLevel) {
		alert('Please fill in all the fields.');
		return false;
	} else if (imageSrc == defaultImg) {
		alert('Please pick an image or take a snapshot.');
		console.log('image = defaultimg');
		return false;
	} else {
		return true;
	}
}

// slice string starting from phrase
function substringer(str, phrase) {
    const index = str.indexOf(phrase);
    str = (index !== -1) ? str.slice(index) : ''; 
    return str;
}

// table if empty
addEventListener('load', function(){
	if (window.location.pathname == student_info_path) {
		let emptyStudentStringSpan = document.getElementById('empty-student-table-span');
		// empty-student-table-span
		const student = document.querySelectorAll('#student-info-table tbody tr').length;
		
		if (student) {
			emptyStudentStringSpan.classList.add('hidden');
		} else {
			emptyStudentStringSpan.classList.remove('hidden');
		}
	}

	if (window.location.pathname == attendance_viewer_path) {
		let emptyAttendanceViewerSpan = document.getElementById('empty-attendance-viewer-table-span');
		// empty-attendance-viewer-table-span
		const attendanceViewer = document.querySelectorAll('#attendance-viewer-table tbody tr').length;

		if (attendanceViewer) {
			emptyAttendanceViewerSpan.classList.add('hidden');
		} else {
			emptyAttendanceViewerSpan.classList.remove('hidden');
		}
	}

	if (window.location.pathname == attendance_log_path) {
		let emptyAttendanceLogSpan = document.getElementById('empty-attendance-log-table-span');
		// empty-attendance-log-table-span
		const attendanceLog = document.querySelectorAll('#attendance-log-table tbody tr').length;

		if (attendanceLog) {
			emptyAttendanceLogSpan.classList.add('hidden');
		} else {
			emptyAttendanceLogSpan.classList.remove('hidden');
		}
	}
});

function deleteStudent(button) {
	const idno = button.dataset.idno;
	console.log(idno)
	const ok = confirm("Are you sure you want to delete this student? All of the student's relevant attendance records will also be deleted. This is currently NOT RECOVERABLE.");
	if (ok) {
		const path = delete_student_path;
		const kwargs = {idno:idno};
		postData(path, kwargs);
	}
}

function postData(path, kwargs, method='post') {
	const form = document.createElement('form');
	form.method = method;
	form.action = path;

	for (const key in kwargs) {
		const hiddenField = document.createElement('input');
		hiddenField.type = 'hidden';
		hiddenField.name = key;
		hiddenField.value = kwargs[key];

		form.appendChild(hiddenField);
	}

	document.body.appendChild(form);
	form.submit();
	form.remove();
}

function addStudent() {
	let modal = document.getElementById('student-modal');
	let modalCard = document.getElementById('student-modal-card');
	showModal(modal, modalCard);
	document.getElementById('edit-add-flag').value = 'add';
	console.log('EDIT ADD FLAG: ' + document.getElementById('edit-add-flag').value);

	document.getElementById('idno').readOnly = false;
	document.getElementById('image').src = defaultImg;
	document.getElementById('qrcode').src = defaultImg;
}

function editStudent(button) {
	let modal = document.getElementById('student-modal');
	let modalCard = document.getElementById('student-modal-card');
	showModal(modal, modalCard);
	let editFlag = document.getElementById('edit-add-flag');
	editFlag.value = 'edit';
	console.log('EDIT ADD FLAG: ' + document.getElementById('edit-add-flag').value);
	modalIdNo = button.dataset.idno;

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

function toggleSwitchToCam() {
	let editFlag = document.getElementById('switch-to-cam-flag');
	let cameraBtn = document.getElementById('camera-button');

	if (editFlag.checked == true) {
		document.getElementById('modal-hide-when-edit').classList.add('hidden');
		document.getElementById('modal-show-when-edit').classList.remove('hidden');
		cameraBtn.classList.remove('hidden');
		try {
			Webcam.attach( '#webcam' );
			setWebcam();
		} catch (err) {
			console.log("toggleSwitchToCam: ", err);
		}
	} else {
		document.getElementById('modal-hide-when-edit').classList.remove('hidden');
		document.getElementById('modal-show-when-edit').classList.add('hidden');
		cameraBtn.classList.add('hidden');
		closeWebcam();
	}

	editFlag.checked = !editFlag.checked;
}

function setWebcam() {
	const webcamContainer = document.getElementById('webcam');
	const height = webcamContainer.offsetHeight;
	const width = webcamContainer.offsetWidth;
	console.log("w: " + width)
	console.log("h: " + height)
	Webcam.set({
		width: width,
		height: height
	})
}

function takeSnapshot() {
	const idno = document.getElementById('idno').value;
	if (idno != '') {
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
	} else {
		alert("Please state the student's idno first before snapping a picture.");
	}
}

function closeWebcam() {
	if (Webcam.live) {
		Webcam.reset()
	}
}

// Revert changes in "Edit" mode or remove new data inputted in modal in "Add" mode
function cancelData(id) {
	const flag = document.getElementById('edit-add-flag');
	console.log('EDIT ADD FLAG: ' + document.getElementById('edit-add-flag').value);
	const button = document.getElementById("edit-button-".concat(id));

	let idNo = document.getElementById('idno');
	let lastName = document.getElementById('lastname');
	let firstName = document.getElementById('firstname');
	let courseName = document.getElementById('course');
	let courseLevel = document.getElementById('level');
	let qrCode = document.getElementById('qrcode');
	let imageSrc = document.getElementById('image');
	let imageUploadSrc = document.getElementById('image-upload');

	if (flag.value == "edit") {
		const idno = button.dataset.idno;
		const lastname = button.dataset.lastname;
		const firstname = button.dataset.firstname;
		const course = button.dataset.course;
		const level = button.dataset.level;
		const qrcode = button.dataset.qrcode;
		const image = button.dataset.image;
		idNo.value = idno;
		lastName.value = lastname;
		firstName.value = firstname;
		courseName.value = course;
		courseLevel.value = level;
		qrCode.src = qrcode;
		imageSrc.src = image;
		imageUploadSrc.value = '';
		try {
			document.getElementById('webcam-result').querySelector('img').src = '';
		} catch (err) {
			console.log('Webcam inner html dont yet exist!    ', err)
		}
	} else {
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
	}

	// console.log('idno  ', idNo.value)
	// console.log('lastname      ', lastName.value)
	// console.log('firstname  ', firstName.value)
	// console.log('course  ', courseName.value)
	// console.log('level  ', courseLevel.value)
	// console.log('qr  ', qrCode.src)
	// console.log('img  ', imageSrc.src)
	// console.log('img-upload  ', imageUploadSrc.value)
}

function showModal(modal, modalCard) {
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

function hideModal(modal, modalCard) {
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
    tooltip.followMouseCleanup = followMouse(tooltip);
    setTimeout(() => {
        tooltip.classList.remove('opacity-0');
        tooltip.classList.add('opacity-100');
    }, 0);
}

function hideTooltip(tooltipId) {
    let tooltip = document.getElementById(tooltipId);
    tooltip.classList.remove('opacity-100');
    tooltip.classList.add('opacity-0');
    if (tooltip.followMouseCleanup) {
    	tooltip.followMouseCleanup();
    	tooltip.followMouseCleanup = null;
    }
    setTimeout(() => {
        tooltip.classList.add('hidden');
    }, 300);
}

function followMouse(element) {
	const mouselistener = (event) => {
		const x = event.offsetX;
		const y = event.offsetY + 15;
		element.style.transform = `translate(${x}px, ${y}px`;
	};

	document.addEventListener('mousemove', mouselistener);
	return () => document.removeEventListener('mousemove', mouselistener);
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
