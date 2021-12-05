import OtpinAja, { Layanan } from "../src";
// https://otpinaja.com/
// https://otpinaja.com/api/documentation
const APIKEY = "APIF84OVBO1638589689149";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let otpin = new OtpinAja().setApiKey(APIKEY);
(async () => {
	let list_layanan: Layanan[] = await otpin.ListLayanan();
	console.log(list_layanan);
	let layanan: Layanan | null = await otpin.Layanan(207);
	console.log(layanan);

	if (layanan) {
		// *Hati hati dengan order, apabila anda memiliki saldo, saldo anda akan berkurang
		let order = await otpin.Order(layanan.id);
		console.log(order);

		// Listen otp
		otpin.UbahOrderStatus(order.id, "processing");

		while (true) {
			let orderStatus = await otpin.OrderStatus(order.id);
			console.log(orderStatus);
			if (orderStatus.sms != "") {
				console.log(orderStatus);
				break;
			}
			delay(2000);
		}

		// berhentikan proses
		otpin.UbahOrderStatus(order.id, "done");
	}
})();
