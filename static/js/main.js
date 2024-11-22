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

	let idNo = document.getElementById('idno').value = idno;
	let lastName  = document.getElementById('lastname').value = lastname;
	let firstName = document.getElementById('firstname').value = firstname;
	let courseName = document.getElementById('course').value = course;
	let yearLevel = document.getElementById('level').value = level;
}

function cancelData(button) {
	const idno = button.dataset.idno;
	const lastname = button.dataset.lastname;
	const firstname = button.dataset.firstname;
	const course = button.dataset.course;
	const level = button.dataset.level;

	let idNo = document.getElementById('idno').value = idno;
	let lastName  = document.getElementById('lastname').value = lastname;
	let firstName = document.getElementById('firstname').value = firstname;
	let courseName = document.getElementById('course').value = course;
	let yearLevel = document.getElementById('level').value = level;
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
}