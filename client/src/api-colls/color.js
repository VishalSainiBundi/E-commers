import { axiosApiInstrector } from "@/helper/helper";

async function getColor() {
    try {
        const response = await axiosApiInstrector.get("color");
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

async function getColorById(id) {
    try {
        const response = await axiosApiInstrector.get(`/color/${id}`);
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

export { getColor, getColorById };
