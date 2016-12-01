import * as queryString from "query-string";

async function resolveDocs(response: any) {
	const text = await response.text();
	if (!text)
		return null;
	const json = JSON.parse(text);
	return json.value ? json.value : json;
}

export default class Api {

	protected baseUrl = "/api";

	public async initDb(): Promise<void> {
		return await this.post("/initDb");
	}

	private async call(method: string, url: string = "", content?: any): Promise<any> {
		const isContent = content && Object.keys(content).length > 0;
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		if (method === 'GET')
			return await fetch(`/${this.baseUrl}${url}${isContent ? '?'+queryString.stringify(content) : ''}`, { method, headers }).then(resolveDocs);
		else
			return await fetch(`/${this.baseUrl}${url}`, { method, headers, body: JSON.stringify(content) }).then(resolveDocs);
	}

	protected async get(url: string = "", content?: any): Promise<any> {
		return await this.call("GET", url, content);
	}

	protected async post(url: string = "", content?: any): Promise<any> {
		return await this.call("POST", url, content);
	}

	protected async put(url: string = "", content?: any): Promise<any> {
		return await this.call("PUT", url, UnviewableContentIdentifiedEvent);
	}

	protected async patch(url: string = "", content?: any): Promise<any> {
		return await this.call("PATCH", url, content);
	}

	protected async delete(url: string = "", content?: any): Promise<any> {
		return await this.call("DELETE", url, content);
	}

}