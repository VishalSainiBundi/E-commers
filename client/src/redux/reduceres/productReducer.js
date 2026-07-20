import { createSlice } from "@reduxjs/toolkit";

const ProductSlice= createSlice(
    {
        name:"product",
        initialState:{
            data:[],
        img_Url:""
            },
            reducers:{
                getData(){

                },
                homeData(){

                },
                activeData(){

                }
            }
    }
)

export const {getData, homeData, activeData} = ProductSlice.actions;

export default ProductSlice.reducer