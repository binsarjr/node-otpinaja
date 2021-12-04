class OrderException extends Error {
	constructor(public message: string) {
		super(message);
		this.name = "OrderException";
	}
}

export default OrderException;
