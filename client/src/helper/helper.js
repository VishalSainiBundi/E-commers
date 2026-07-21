import axios from 'axios';
import {  toast } from 'react-toastify';


function generateSlug(text) {
  return text
    .toString()                  // ensure it's a string
    .trim()                      // remove leading/trailing spaces
    .toLowerCase()               // convert to lowercase
    .replace(/\s+/g, '-')        // replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')    // remove all non-word chars
    .replace(/\-\-+/g, '-')      // replace multiple hyphens with single hyphen
    .replace(/^-+/, '')          // trim hyphens from start
    .replace(/-+$/, '');         // trim hyphens from end
}

const notify = (msg, flag) => 
  toast(msg, { type: flag == 0 ? "success" : "error" });

const axiosApiInstrector = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://e-commers-tj4b.onrender.com/",
})

const toLocalPrice= (price)=>{
return Number(price).toLocaleString("en-IN", {
  style: "currency",
  currency: "INR",
});
}


export {generateSlug, notify, axiosApiInstrector,toLocalPrice}