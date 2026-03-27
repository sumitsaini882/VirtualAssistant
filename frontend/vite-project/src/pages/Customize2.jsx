import React, { useContext, useState } from 'react'
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function Customize2() {
   const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
   const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")
   const [loading,setLoading] = useState(false)
   const navigate = useNavigate()

// const handleUpdateAssistant = async ()=>{
//    setLoading(true)
//    try {
//       let formData =new FormData()
//       formData.append("assistantName",assistantName)
//       if (backendImage) {
//          formData.append("assistantName",backendImage)
//       } else {
//          formData.append("imageUrl",selectedImage)
//       }

//       const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
//      setLoading(false)
//       console.log(result.data)
//       setUserData(result.data)
//       navigate("/")
//    } catch (error) {
//       setLoading(false)
//       console.log(error)
//    }
// }
const handleUpdateAssistant = async () => {
   setLoading(true)
   try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)

      if (backendImage) {
         // ✅ Key ka naam "assistantImage" hona chahiye
         formData.append("assistantImage", backendImage) 
      } else {
         formData.append("imageUrl", selectedImage)
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
         withCredentials: true,
         headers: {
            'Content-Type': 'multipart/form-data' // Optional but good practice
         }
      })
      
      setLoading(false)
      setUserData(result.data)
      navigate("/")
   } catch (error) {
      setLoading(false)
      console.log("Upload Error:", error.response?.data || error.message)
   }
}

  return (
     <div className="w-full min-h-screen bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col  p-[20px] relative ">
      <IoMdArrowRoundBack  className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]'onClick={()=>navigate("/customize")}/>
        <h1 className="text-white text-[30px] mb-[10px] text-center">Enter Your <span className="text-blue-200">Assistant Name</span></h1>
         <input
          type="text"
          placeholder="eg. Shifra"
          className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300  px-[20px] py-[10px] rounded-full text-[18px]"
          required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}
        />{assistantName &&  <button  className="min-w-[300px] h-[60px] mt-[30px] cursor-pointer text-black font-semibold bg-white rounded-full text-[19px]" disabled={loading} onClick={()=>{
         handleUpdateAssistant()
        }}>{!loading?"Finally Create Your Assistant":"Loading..."}</button> }
       
     </div>
  )
}

export default Customize2