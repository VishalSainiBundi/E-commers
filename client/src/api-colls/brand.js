import { axiosApiInstrector } from "@/helper/helper";

async function getBrand() {
    try {
        const response = await axiosApiInstrector.get("brand");

        if (response.data.flag === 0) {
            return response.data; // { brand: [...], img_Url: "...", flag: 0 }
        } else {
            return {
                brand: [],
                img_Url: "",
                flag: 1
            };
        }

    } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error(error);
        return {
            brand: [],
            img_Url: "",
            flag: 1
        };
    }
}


async function getBrandById(id) {
    try {
        const response = await axiosApiInstrector.get(`brand/${id}`);
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

export { getBrand, getBrandById };
