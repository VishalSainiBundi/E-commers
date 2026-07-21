// import { getColorById } from "@/api-colls/color";
// import ColorEdit from "@/Components/admin/colorEdit";

// export default async function ColorEditPage({ params }) {
 export default async function EditCategory({ params }) {
  const resolvePromise= await params
  const id=resolvePromise?.category_id

  // यहाँ API call करें
  // const colorData = await getColorById(id);

  return (
    <div>
      Editing color with ID: {id}
    </div>
  );
}


  // अब id को API कॉल में यूज़ करें...


// return
//   const colorData = await getColorById(id);

//   console.log("colorData:", colorData);

//   // handle empty or undefined data safely
//   if (!colorData || !colorData.color) {
//     return <p>Color not found.</p>;
//   }

//   return (
//     <ColorEdit color={colorData.color} />
//   );
// }
