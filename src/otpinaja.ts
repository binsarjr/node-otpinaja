import got from "got/dist/source";
import endpoint from "./endpoint";
import ApiKeyException from "./exception/apikey_exception";
import OrderException from "./exception/order_exception";
import { Layanan, Order, OTPInResponse, StatusOrder } from "./types";

const parseOrder = (data: any): Order => {
	return {
		id: parseInt(data["id"]),
		service_name: data["service_name"],
		service_id: parseInt(data["service_id"]),
		number: data["number"],
		otp: data["otp"],
		sms: data["sms"],
		status: data["status"],
	};
};

const parseLayanan = (data: any): Layanan => {
	return {
		id: parseInt(data["id"]),
		nama_aplikasi: data["nama_aplikasi"],
		jumlah_tersedia: parseInt(data["jumlah_tersedia"]),
		harga_idr: parseInt(data["harga_idr"]),
		status: data["status"],
		last_update: data["last_update"],
	};
};

export default class OtpinAja {
	private apikey: string = "";

	setApiKey(key: string) {
		this.apikey = key;
		return this;
	}

	private async request<T>(
		url: string,
		data?: object
	): Promise<OTPInResponse<T>> {
		let response: OTPInResponse<T> = await got
			.post(url, {
				form: {
					api_key: this.apikey,
					...data,
				},
			})
			.json();
		if (!response.status) {
			if (response.msg == "api_key tidak ditemukan") {
				throw new ApiKeyException(ApiKeyException.INVALID_APIKEY);
			}
		}
		return response;
	}
	async Order(layanan_id: number) {
		let response = await this.request<Order>(endpoint.ORDER, {
			service_id: layanan_id,
		});
		if (!response.status) {
			if (response.msg == "saldo tidak cukup") {
				throw new OrderException("saldo tidak cukup");
			}
		}
		return response.data;
	}

	async OrderAktif() {
		let response = await this.request<Order[]>(endpoint.ACTIVE_ORDERS);
		return parseOrder(response.data);
	}

	async OrderStatus(order_id: number) {
		let response = await this.request<Order>(endpoint.STATUS, {
			order_id,
		});
		return parseOrder(response.data);
	}

	async UbahOrderStatus(order_id: number, status: StatusOrder) {
		let response = await this.request<Order>(endpoint.SET_STATUS, {
			order_id,
			status,
		});
		let order = parseOrder(response.data);
		if (order.status == "STATUS_DONE") {
			throw new OrderException("order sudah selesai");
		}
		return order;
	}

	async Layanan(id: number): Promise<Layanan | null> {
		let layanan = (await this.ListLayanan()).filter(
			(predicate) => predicate.id == id
		);
		return layanan.length > 0 ? layanan[0] : null;
	}
	async ListLayanan(): Promise<Layanan[]> {
		let response = await this.request<Layanan[]>(endpoint.LIST_LAYANAN);
		return response.data.map((resp) => parseLayanan(resp));
	}
}
