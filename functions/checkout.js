export async function onRequestPost(context) {
	const url = new URL(context.request.url).origin;
	const formData = await context.request.formData();

	let product_ids = {
		"producto1":	"price_1UYrlTCNOpaMFlfCohb70sSt",
		"producto2":	"price_1UYrrtCNOpaMFlfCN556FOnl",
		"producto3":	"price_1UYrrDCNOpaMFlfCK8QrQvCX",
		"producto4":	"price_1UYrsDCNOpaMFlfCc37FexGy"
	};

	let params = new URLSearchParams({
		mode:							'payment',
		success_url:					`${url}/?success=true`,
		cancel_url:						`${url}?success=false`,
		locale:							'auto',
	});

	let count = 0;
	Object.entries(product_ids).forEach(([nombre, id]) => {
		let data = formData.get(nombre);
		if (data > 0) {
			params.append(`line_items[${count}][quantity]`, data);
			params.append(`line_items[${count}][price]`, id);
			count += 1;
		}
	});

	const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${context.env.STRIPE_API_KEY}`
		},
		body: params
	});

	const session = await res.json();

	return Response.redirect(session.url, 303);
}
