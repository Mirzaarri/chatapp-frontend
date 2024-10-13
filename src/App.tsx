// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error from "./Error";
import {ProtectedRoute} from "./components";
import { AuthComponent } from "./auth";
import Chat from "./views/Chat";
import Home from "./views/Home";
import { SocketProvider } from "./context/socket.context";

function App() {
  return (
    <SocketProvider>
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
          path="/chat/:userId"
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
    </SocketProvider>
  );
}

export default App;
