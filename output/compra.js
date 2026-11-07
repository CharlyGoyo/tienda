document.addEventListener('DOMContentLoaded', () => {
	let carrito = localStorage.getItem('carrito');
	let inputs = new Map();
	const inputs_producto = document.querySelectorAll('.input_producto');
	const carritoform = document.querySelector('.carrito');
	const urlParams = new URLSearchParams(window.location.search);

	const updateInputs = () => {
		inputs.forEach((arr, product) => {
			if (carrito[product] == null || carrito[product] < 1) {
				if (arr[0] != null) {
					arr[0].value = 0;
				}
				/*elimina el input del carrito y el h3 de arriba*/
				if (arr[1] != null) {
					arr[1].remove();
					arr[2].remove();
					console.log(arr[1]);
					arr[1] = null;
					arr[2] = null;
				}
			}
			else {
				if (arr[1] == null) {
					/*añade el input del carrito y el h3 de arriba*/
					arr[2] = carritoform.appendChild(document.createElement('h3'));
					arr[2].textContent = product + ':'

					arr[1] = carritoform.appendChild(document.createElement('input'));
					arr[1].min = 0;
					arr[1].name = product;
					arr[1].type = "number";
					arr[1].addEventListener('change', (input) => {updateCarrito(input.target.name, input.target.value)});
				}
				arr[1].value = carrito[product];
				if (arr[0] != null) {
					arr[0].value = carrito[product];
				}
			}
		});
	};

	const updateCarrito = (name, value) => {
		console.log("carrito uptadeado");
		carrito[name] = value;
		if (!inputs.has(name)) {
			inputs.set(name, [null, null, null]);
		}
		localStorage.setItem('carrito', JSON.stringify(carrito));
		updateInputs();
	};

	if (!carrito || carrito === 'undefined' || urlParams.get('success') === 'true') {
		carrito = {
			"producto1":	0,
			"producto2":	0,
			"producto3":	0,
			"producto4":	0
		};
		localStorage.setItem('carrito', JSON.stringify(carrito));
	}
	else {
		carrito = JSON.parse(carrito);
	}

	Object.entries(carrito).forEach(([clave, valor]) => {
		inputs.set(clave, [null, null, null])
	});
	inputs_producto.forEach((input) => {
		inputs.set(input.name, [input, null, null]);
		input.addEventListener('change', (input) => {updateCarrito(input.target.name, input.target.value)});
	});

	updateInputs();
	window.addEventListener('focus', () => {
		updateInputs();
	});
});
