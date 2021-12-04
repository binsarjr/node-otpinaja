export interface OTPInResponse<T> {
	status: boolean;
	msg: string;
	data: T;
}

export type StatusOrder = "processing" | "cancel" | "retry" | "done";

export interface Order {
	id: number;
	service_name: string;
	service_id: number;
	number: string;
	otp: string;
	sms: string;
	status: StatusOrder | "pending" | "error" | "STATUS_DONE";
}

export type StatusLayanan = "Aktif" | string;

export interface Layanan {
	id: number;
	nama_aplikasi: string;
	jumlah_tersedia: number;
	harga_idr: number;
	status: StatusLayanan;
	last_update: string;
}
