import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import AuthWrapper from "./AuthWrapper"; // Importa el componente AuthWrapper
import { Feedback } from "./components/feedback/feedback";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthWrapper />
      <Feedback /> {/* Usa el componente Feedback aquí */}
    </BrowserRouter>
  );
}

export default App;