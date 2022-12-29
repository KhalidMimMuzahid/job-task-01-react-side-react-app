import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const EachUser = ({ eachInfo: fromDatabaseInfo, selectors }) => {
  const [eachInfo, setEachInfo] = useState(fromDatabaseInfo);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const handleFormSubmit = (data) => {
    console.log("data: ", data);
    if (data?.name?.length === 0) {
      return alert("please, input your name");
    }
    if (!(data?.name || data?.sector)) {
      return alert("please, change some value");
    }

    const { name, sector: sectorString } = data;
    let sectorName;
    let sectorValue;
    if (!data?.sector) {
      console.log("select is undefined");
      sectorName = eachInfo?.sector?.sectorName;
      sectorValue = eachInfo?.sector?.sectorValue;
    } else {
      let sectorArray = sectorString.split("==");
      sectorName = sectorArray[0];
      sectorValue = sectorArray[1];
    }
    const sector = { sectorName, sectorValue };
    const inputFormsInfo = { name, sector };
    console.log("inputFormsInfo: ", inputFormsInfo);
    fetch(
      `https://job-task-mu.vercel.app/updateinputformsfnfo?_id=${eachInfo?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputFormsInfo),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.modifiedCount) {
          toast.success("your information updated successfully");
          // setIsRefresh((prev) => !prev);
          const newEachInfo = { ...eachInfo };
          newEachInfo.sector = sector;
          newEachInfo.name = name;
          setEachInfo(newEachInfo);
          setIsEditing(false);
        }
      });
  };
  return (
    <div className="flex flex-col gap-2 border border-black px-4 py-2">
      {/* <div className="flex flex-col gap-2 border border-black px-4 py-2">
        <p>
          hey, <span className="font-bold">{eachInfo?.name}</span>,{" "}
        </p>
        <p>
          you select{" "}
          <span className="font-bold">{eachInfo?.sector?.sectorName}</span>
        </p>
        <button className=" btn btn-sm">update</button>
      </div> */}
      <form
        action=""
        className="grid grid-cols-1 gap-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div>
          {!isEditing && <label htmlFor="name">Name: </label>}
          <input
            disabled={!isEditing}
            defaultValue={eachInfo?.name}
            {...register("name")}
            id="name"
            type="text"
            placeholder="Type here"
            className={`${
              isEditing ? "input input-bordered " : "max-w-sm"
            }  w-full `}
          />
        </div>
        <div className="flex">
          {!isEditing && <h1 className="mr-2">you select: </h1>}
          <select
            disabled={!isEditing}
            className={`${
              isEditing ? "select select-bordered" : "max-w-sm"
            }   w-full `}
            {...register("sector")}
          >
            <option
              selected
              value={
                eachInfo?.sector?.sectorName +
                "==" +
                eachInfo?.sector?.sectorValue
              }
            >
              {eachInfo?.sector?.sectorName}
            </option>
            {selectors?.map((eachOption, index) => (
              <option key={index} value={eachOption?.value}>
                {eachOption?.label}
              </option>
            ))}
          </select>
          {/* {sectorError && (
            <p role="alert" className="text-red-500 font-bold">
              {sectorError}
            </p>
          )} */}
        </div>
        <div>
          {isEditing ? (
            <button type="submit" className="btn w-full btn-sm bg-green-600">
              update
            </button>
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              className="btn w-full btn-sm"
            >
              edit
            </h1>
          )}
        </div>
      </form>
    </div>
  );
};

export default EachUser;
