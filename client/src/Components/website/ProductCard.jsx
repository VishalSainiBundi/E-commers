import { FiMoreVertical } from "react-icons/fi";
import Home_Productcard from "./card";
const card=[1,]
export default function ProductCard() {
  return (
   <div className="w-full flex pt-20 px-2">
      <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>
             {
   
               card.map(
                 (c,ind)=>{
                   return(
                     <Home_Productcard key={ind}/>
                   )
                 }
               )
             }
   
   
   
     
      <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>
   
     </div>
  );
}
