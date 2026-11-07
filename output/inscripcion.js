document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const inscriInput = document.getElementById('inscribirse');
	const fillInputs = document.querySelectorAll('[data-input-type="fill"]');
	const correoInputs = document.querySelectorAll('[data-input-type="correo"]');
	const almenosunoInputs = document.querySelectorAll('[data-input-type="almenosuno"]');
	const errormsg = document.querySelector('.error');
	const remoteerrormsg = document.querySelector('.errorremote');
	let almenosuno = new Map();
	let correctos = new Map();
	let errores = new Map();

	if (urlParams.get('inscrito') === 'true') {
		remoteerrormsg.style.display = 'block';
		remoteerrormsg.style.color = 'green';
		remoteerrormsg.textContent = 'Ya estás inscrito :D (aún no va el correo automático, pero ya estás en la DB :D).';
	}
	else if (urlParams.get('inscrito') === 'false') {
		remoteerrormsg.style.display = 'block';
		remoteerrormsg.style.color = 'red';
		remoteerrormsg.textContent = 'Error en el servidor. Mira a ver qué has tocao.';
	}

	fillInputs.forEach((input) => {
		correctos.set(input.name, false);
		input.addEventListener('blur', (e) => {
			if(e.target.value == '') {
				correctos.set(input.name, false);
				input.style.borderColor = 'red';
				errores.set(input.name, `te falta el ${input.name} bro`);
			}
			else {
				correctos.set(input.name, true);
				input.style.borderColor = 'green';
				errores.delete(input.name);
			}
			actualizaError();
			checkCorrecto();
		});
	});

	correoInputs.forEach((input) => {
		correctos.set(input.name, false);
		input.addEventListener('blur', (e) => {
			if(e.target.value == '' || e.target.checkValidity() === false) {
				correctos.set(input.name, false);
				input.style.borderColor = 'red';
				errores.set(input.name, 'el correo no es válido bro');
			}
			else {
				correctos.set(input.name, true);
				input.style.borderColor = 'green';
				errores.delete(input.name);
			}
			actualizaError();
			checkCorrecto();
		});
	});

	almenosunoInputs.forEach((input) => {
		almenosuno.set(input.name, false);
		correctos.set(input.name, false);
		correctos.set(input.dataset.inputType, false);
		input.addEventListener('change', (e) => {
			correctos.set(input.name, true);
			if(e.target.value == "si") {
				almenosuno.set(input.name, true);
			}
			else {
				almenosuno.set(input.name, false);
			}
			let hayalmenosuno = false;
			almenosuno.forEach((valor, _) => {
				if (valor === true) {
					hayalmenosuno = true;
				}
			});
			if (hayalmenosuno === true) {
				correctos.set(input.dataset.inputType, true);
				errores.delete(input.dataset.inputType);
			}
			else {
				correctos.set(input.dataset.inputType, false);
				errores.set(input.dataset.inputType, 'O te vacunas o pillas un seguro bro');
			}
			actualizaError();
			checkCorrecto();
		});
	});

	const actualizaError = () => {
		if (errores.size === 0) {
			errormsg.style.display = 'none';
		}
		else {
			errormsg.style.display = 'block';
			errormsg.textContent = Array.from(errores.entries()).at(-1)[1];
		}
	}

	const checkCorrecto = () => {
		remoteerrormsg.style.display = 'none';
		inscriInput.disabled = false;
		for (const valor of correctos.values()) {
			if (valor !== true){
				inscriInput.disabled = true;
			}
		}
	}
});
