"use strict";
class HTTPCodes {

	static SuccesfullResponse = {
		Ok: 200
	}
	
	static ClientSideErrorResponse = {
		BadRequest: 400,
		Unauthorized: 401,
		PaymentRequired: 402,
		Forbidden: 403,
		NotFound: 404,
		MethodNotAllowed: 405,
		NotAcceptable: 406
	}

	static ServerErrorRespons = {
        InternalError: 500,
        NotImplemented: 501,
    }
}

export default HTTPCodes;