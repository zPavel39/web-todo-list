import React, { useEffect } from 'react';
import './App.less';
import { FormTask } from './components/FormTask/formTask';
import { Header } from './components/Header/header';
import { ListTasks } from './components/ListTasks/listTasks';

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