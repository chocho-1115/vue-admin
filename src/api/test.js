import request from "@/common/request"

export function testError(status) {
	return request({
		url: `/test/error/${status}`,
		method: "get",
		// params: {status},
	})
}
