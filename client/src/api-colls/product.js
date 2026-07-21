import { axiosApiInstrector } from "@/helper/helper";

async function getProduct(searchParams={}) {
    try {

  const query = new URLSearchParams();
if (searchParams.home) query.append("home", searchParams.home);
  if (searchParams.status) query.append("status", searchParams.status);
  if (searchParams.top) query.append("top", searchParams.top);
  if (searchParams.best) query.append("best", searchParams.best);
  if (searchParams.product_slug) query.append("product_slug", searchParams.product_slug);
  if (searchParams.limit) query.append("limit", searchParams.limit);
  if (searchParams.category_slug) query.append("category_slug", searchParams.category_slug);
  if (searchParams.color_ids) query.append("color_ids", searchParams.color_ids);
  if (searchParams.brand_ids) query.append("brand_ids", searchParams.brand_ids);
  if(searchParams.sortby) query.append("sortby",searchParams.sortby)

        const response = await axiosApiInstrector.get(`product?${query.toString()}`);
        if (response.data.flag == 0) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error(error);
        return [];
    }
}

async function getProductById(id) {
    try {
        const response = await axiosApiInstrector.get(`product/${id}`);
        if (response.data.flag == 0) {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error(error);
        return {};
    }
}

export { getProduct,getProductById };
