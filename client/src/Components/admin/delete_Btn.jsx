'use client'
import { axiosApiInstrector, notify } from "@/helper/helper";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'
const Delete = ({ id,url }) => {
  const router = useRouter()

  const DeleteHandler = () => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });

        axiosApiInstrector.delete(url).then(
          (response) => {
            // console.log(response)
            if (response.data.flag == 0) {
              notify(response.data.msg, response.data.flag)

              router.refresh();
            }
          }
        ).catch(
          (error) => {

          }
        )






      }
    });
















  }


  return (
    <button className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer" onClick={DeleteHandler}>
      Delete
    </button>
  )
};
export default Delete