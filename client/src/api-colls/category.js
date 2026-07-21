import { axiosApiInstrector } from "@/helper/helper";

async function getCategory(queryParams = {}) {

  const query = new URLSearchParams();

if (queryParams.home) query.append("home", queryParams.home);
  if (queryParams.status) query.append("status", queryParams.status);
  if (queryParams.top) query.append("top", queryParams.top);
  if (queryParams.best) query.append("best", queryParams.best);
  if (queryParams.slug) query.append("slug", queryParams.slug);
  if (queryParams.limit) query.append("limit", queryParams.limit);
    
    try {
        const response = await axiosApiInstrector.get("category");
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

async function getCategoryById(id) {
    try {
        const response = await axiosApiInstrector.get(`category/${id}`);
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

export { getCategory, getCategoryById };
