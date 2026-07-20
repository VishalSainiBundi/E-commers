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
        console.log(error);

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

export { getBrand, getBrandById };
