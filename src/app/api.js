async function resolveDocs(response) {
	const json = await response.json();
	return json.value ? json.value : json;
}

async function call(method, url, content) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	return await fetch(`/api${url}`, { method, headers, body: JSON.stringify(content) }).then(resolveDocs);
}

export default {
	get: (...args) => call("GET", ...args),
	post: (...args) => call("POST", ...args),
	put: (...args) => call("PUT", ...args),
	patch: (...args) => call("PATCH", ...args),
	delete: (...args) => call("DELETE", ...args)
};