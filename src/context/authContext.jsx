import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [curentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [status, setStatus] = useState(null);
  const login = async (inputs) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        inputs,
        { withCredentials: true }
      );

      setStatus(res.status);

      if (status === 200) {
        toast.success("connexion réussie!", {
          autoClose: 2000,
        });
        setCurrentUser(res.data);
      }
    } catch (err) {
      if (err.response) {
        setStatus(err.response.status);
        if (err.response.status === 409) {
          toast.error("utilisateur non trouvé", {
            autoClose: 2000,
          });
        } else if (err.response.status === 400) {
          toast.error("Mauvais mot de passe", {
            autoClose: 2000,
          });
        }
      } else {
        toast.error("Erreur de connexion", {
          autoClose: 2000,
        });
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(curentUser));
  }, [curentUser]);

  return (
    <AuthContext.Provider value={{ curentUser, login, status }}>
      {children} <ToastContainer />
    </AuthContext.Provider>
  );
};
