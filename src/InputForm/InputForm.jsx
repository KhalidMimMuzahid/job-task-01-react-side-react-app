import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const InputForm = ({ selectors, setIsRefresh }) => {
  const [isSecondTime, setIsSecondTime] = useState(false);
  const [sectorError, setSectorError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      //   console.log("value", value);
      if (value?.sector === "pick your Sectors" && isSecondTime) {
        setSectorError("you have to pick a sector");
      } else {
        setSectorError("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isSecondTime]);
  const handleFormSubmit = (data) => {
    setIsSecondTime(true);
    if (data?.sector === "pick your Sectors") {
      return setSectorError("you have to pick a sector");
    }
    // console.log("data: ", data);
    if (!data?.isAgree) {
      alert("please agree to our terms");
      return;
    }
    const { name, sector: sectorString } = data;
    const sectorArray = sectorString.split("==");
    const sectorName = sectorArray[0];
    const sectorValue = sectorArray[1];
    // console.log("name", name);
    // console.log("sectorName=", sectorName, "\nsectorValue=", sectorValue);
    const sector = { sectorName, sectorValue };
    const inputFormsInfo = { name, sector };
    console.log("inputFormsInfo:", inputFormsInfo);
    fetch("https://job-task-mu.vercel.app/inputformsfnfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputFormsInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.acknowledged) {
          toast.success("your form submitted");
          setIsRefresh((prev) => !prev);
        }
      });
  };
  return (
    <div>
      <div className=" mx-auto bg-base-100 shadow-xl">
        <h1 className="text-center">
          Please enter your name and pick the Sectors you are currently involved
          in.
        </h1>
        <div className="flex justify-center border">
          <div className="my-4">
            <form
              action=""
              className="grid grid-cols-1 gap-4"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  {...register("name", {
                    required: {
                      value: true,
                      message: "you have to provided your name.",
                    },
                  })}
                  id="name"
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-sm"
                />
                {errors?.name && (
                  <p role="alert" className="text-red-500 font-bold">
                    {errors?.name?.message}
                  </p>
                )}
              </div>
              <div>
                <select
                  className="select select-bordered w-full max-w-sm"
                  {...register("sector", {
                    required: {
                      value: true,
                      message: "you have to pick a sector",
                    },
                  })}
                >
                  <option disabled selected>
                    pick your Sectors
                  </option>
                  {selectors?.map((eachOption, index) => (
                    <option key={index} value={eachOption?.value}>
                      {eachOption?.label}
                    </option>
                  ))}
                </select>
                {sectorError && (
                  <p role="alert" className="text-red-500 font-bold">
                    {sectorError}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  {...register("isAgree")}
                />
                <label htmlFor="">Agree to terms</label>
              </div>
              <div>
                <button type="submit" className="btn btn-sm">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
