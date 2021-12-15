# Unofficial API otpinaja.com
Unofficial API otpinaja.com for nodejs. support typescript

## Instalation
Using npm
```bash
npm i @binsarjr/node-otpinaja
```

Using yarn
```bash
yarn add @binsarjr/node-otpinaja
```


## Example
```ts
import OtpinAja, { Layanan } from "../src";
// https://otpinaja.com/
// https://otpinaja.com/api/documentation
const APIKEY = "<APIKEY>";

let otpin = new OtpinAja().setApiKey(APIKEY);
(async () => {
	let list_layanan: Layanan[] = await otpin.ListLayanan();
	console.log(list_layanan);
	let layanan: Layanan = await otpin.Layanan(list_layanan[0].id);
	console.log(layanan);

	// *Hati hati dengan order, apabila anda memiliki saldo, saldo anda akan berkurang
	let order = await otpin.Order(layanan.id);
	console.log(order);

	// Listen otp
	otpin.UbahOrderStatus(order.id, "processing");

	while (true) {
		let orderStatus = await otpin.OrderStatus(order.id);
		if (orderStatus.otp != "") {
			console.log(orderStatus);
			break;
		}
	}

	// berhentikan proses
	otpin.UbahOrderStatus(order.id, "done");
})();

```