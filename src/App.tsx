// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Error from "./Error";
import {ProtectedRoute} from "./components";
import { AuthComponent } from "./auth";
import Chat from "./views/Chat";

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
         <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
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
