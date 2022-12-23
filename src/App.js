import React from "react";
import { FormTask } from "./components/FormTask/formTask";
import { Header } from "./components/Header/header";
import { ListTasks } from "./components/ListTasks/listTasks";
import "./App.less";

function App() {
  return (
    <div className="App">
      <Header />
      <FormTask />
      <ListTasks />
    </div>
  );
}

export default App;
