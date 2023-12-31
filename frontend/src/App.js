import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage.js";
import "./css/App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Main />
      </div>
    </BrowserRouter>
  );
}

function Main() {
  return (
    <main className="content">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </main>
  );
}

function Header() {
  return (
    <header className="header">
      <h1 className="text-center">Citation Needed</h1>
    </header>
  );
}
/*
function Footer() {
  return (
    <footer className="footer">
      <div className="text-center">In Development. All Rights Reserved.</div>
    </footer>
  );
}*/
