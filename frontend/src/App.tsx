import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import BucketPage from "./components/BucketPage";

import "98.css";
import "./styles.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/web/:uuid" element={<BucketPage />} />
      </Routes>
    </>
  );
}

export default App;
