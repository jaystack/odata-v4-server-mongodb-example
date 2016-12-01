import Api from "./Api";
import Category from "../models/Category";
import Product from "../models/Product";

export default class CategoryApi extends Api {

	protected baseUrl = "/api/Categories";

	public async getAll(): Promise<Category[]> {
		return await this.get();
	}

	public async getOne(categoryId: string): Promise<Category> {
		return await this.get(`('${categoryId}')`);
	}

	public async create(category: Category): Promise<Category> {
		return await this.post("", category);
	}

	public async save(categoryId: string, modifications: Category): Promise<void> {
		return await this.patch(`('${categoryId}')`, modifications);
	}

	public async delete(categoryId: string): Promise<void> {
		return await this.delete(`('${categoryId}')`);
	}

	public async getProducts(categoryId: string): Promise<Product[]> {
		return await this.get(`('${categoryId}')/Products`);
	}

	public async addProduct(categoryId: string, productId: string): Promise<void> {
		return await this.post(`/Categories('${categoryId}')/Products/$ref`, {
			"@odata.id": `${window.location.href}api/Products('${productId}')`
		});
	}

	public async deleteProduct(categoryId: string, productId: string): Promise<void> {
		return await this.delete(`('${categoryId}')/Products/$ref?$id=${window.location.href}api/Products('${productId}')`);
	}
}