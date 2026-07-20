import { axiosApiInstrector } from "@/helper/helper";

async function getColor() {
    try {
        const response = await axiosApiInstrector.get("color");
        if (response.data.flag == 0) {
            console.log(response.data);
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getColorById(id) {
    try {
        const response = await axiosApiInstrector.get(`color/${id}`);
        if (response.data.flag == 0) {
            console.log(response.data);
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.log(error);
        return {};
    }
}

export { getColor, getColorById };
