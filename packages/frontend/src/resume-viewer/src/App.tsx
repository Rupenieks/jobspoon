import React from "react";
import { Routes, Route } from "react-router-dom";
import Creator from "./components/Creator";
import PDFPreview from "./components/PDFPreview";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/creator" element={<Creator />} />
      <Route path="/pdfPreview" element={<PDFPreview />} />
    </Routes>
  );
};

export default App;
