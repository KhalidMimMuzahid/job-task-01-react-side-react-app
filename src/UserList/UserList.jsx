import React, { useEffect, useState } from "react";
import EachUser from "./EachUser/EachUser";
const UserList = ({ isRefresh, selectors }) => {
  const [submittedInfo, setSubmittedInfo] = useState([]);
  useEffect(() => {
    fetch("https://job-task-mu.vercel.app/inputformsfnfo")
      .then((res) => res.json())
      .then((data) => {
        // console.log("data: ", data);
        setSubmittedInfo(data);
      });
  }, [isRefresh]);
  return (
    <div className="h-screen overflow-y-auto">
      <div className="card  mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="font-bold text-center text-2xl">our Subscriber: </h1>
          {submittedInfo.length === 0 && (
            <p className="font-bold text-center">No Subscriber here</p>
          )}
          {submittedInfo?.map((eachInfo, index) => (
            <EachUser
              key={eachInfo?._id}
              eachInfo={eachInfo}
              selectors={selectors}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
