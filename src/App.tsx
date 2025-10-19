import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { ToDoBody } from './ToDoBody';
import { ReportPage } from './ReportPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" Component={ ToDoBody }/>
          <Route path="/report-missing-item" Component={ ReportPage }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
