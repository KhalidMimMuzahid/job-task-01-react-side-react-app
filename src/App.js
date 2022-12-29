import "./App.css";
import { useEffect, useState } from "react";
import InputForm from "./InputForm/InputForm";
import UserList from "./UserList/UserList";

function App() {
  const [selectors, setSelectors] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  useEffect(() => {
    fetch("data.json")
      .then((res) => res.json())
      .then((data) => setSelectors(data));
  }, []);

  if (!selectors) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <h1>loading ...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="px-0 md:px-4 my-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputForm selectors={selectors} setIsRefresh={setIsRefresh} />
        <UserList isRefresh={isRefresh} selectors={selectors} />
      </div>
    </div>
  );
}

export default App;
