import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function History() {
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] p-5">
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]"
        onClick={() => navigate("/")}
      />
      <h1 className="text-white text-2xl font-bold mb-5  mt-5 pl-16">📜 Your History</h1>

      <div className="max-w-[600px] mx-auto flex flex-col gap-3">
        {userData?.history && userData.history.length > 0 ? (
          userData.history.map((his, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-3 rounded-lg shadow"
            >
              {his}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No history found</p>
        )}
      </div>
    </div>
  );
}

export default History;
