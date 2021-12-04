class ApiKeyException extends Error {
	public static INVALID_APIKEY: string = "Invalid API_KEY";

	constructor(public message: string) {
		super(message);
		this.name = "ApiKeyException";
	}
}

export default ApiKeyException;
