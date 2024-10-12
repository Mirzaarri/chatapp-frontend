// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Error from "./Error";
import {ProtectedRoute} from "./components";
import { AuthComponent } from "./auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Home Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        {/* Auth Route for Login/Signup */}
        <Route path="/auth" element={<AuthComponent />} />
        
        {/* Catch-All Route for Errors */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
