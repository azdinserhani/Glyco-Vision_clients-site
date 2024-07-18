import "./Register.scss";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Aos from "aos";
import "aos/dist/aos.css";
const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    sexe: "",
    age: "",
    password: "",
  });
  const [passwordErr, setPasswordErr] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    Aos.init({
      duration: 1500,
      once: true,
    });
  });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const err = validatePassword(inputs.password);
    setPasswordErr(err);
  };
  const validatePassword = (password) => {
    const conditions = [
      {
        regex: /.{8,}/,
        message: "Password must be at least 8 characters long",
      },
      {
        regex: /[A-Z]/,
        message: "Password must contain at least one uppercase letter",
      },
      {
        regex: /[a-z]/,
        message: "Password must contain at least one lowercase letter",
      },
      { regex: /[0-9]/, message: "Password must contain at least one number" },
    ];

    for (const condition of conditions) {
      if (!condition.regex.test(password)) {
        return condition.message;
      }
    }

    return "";
  };
  const handleClick = async (e) => {
    e.preventDefault();

    if (inputs && passwordErr === "") {
      try {
        setLoading(true);
        const result = await makeRequest.post("/api/auth/register", inputs);
        setLoading(false);
        toast.success("Inscription réussi!", {
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        setLoading(false);
        setErr(err);
        if (err.response) {
          handleStatus(err.response.status);
        } else {
          toast.error("Quelque chose s'est mal passé. Veuillez réessayer.", {
            autoClose: 2000,
          });
        }
      }
    }
  };

  const handleStatus = (status) => {
    if (status === 403) {
      toast.error("User already exists", {
        autoClose: 2000,
      });
    } else if (status === 400) {
      toast.error("Password required", {
        autoClose: 2000,
      });
    } else {
      toast.error("An error occurred. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="register">
      <div className="container">
        <div className="logo">
          <img
            src="../../../public/logo.ico"
            alt="Logo"
            data-aos="fade-down-right"
          />
        </div>
        <div className="info">
          <form onSubmit={handleClick}>
            <div className="input" data-aos="fade-down-left">
              <label htmlFor="nome">Nom</label>
              <div className="input-area">
                <i>
                  <PersonOutlinedIcon fontSize="small" />
                </i>
                <input
                  type="text"
                  placeholder="Entre Votre nom"
                  id="nome"
                  name="username"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input" data-aos="fade-down-right">
              <label htmlFor="email">Email</label>
              <div className="input-area">
                <i>
                  <EmailOutlinedIcon fontSize="small" />
                </i>
                <input
                  type="email"
                  placeholder="Entre Votre email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="personne">
              <div className="input" data-aos="fade-down-left">
                <label htmlFor="genre">Genre</label>
                <div className="input-area">
                  <i>
                    <WcOutlinedIcon fontSize="small" />
                  </i>
                  <select name="sexe" onChange={handleChange} required>
                    <option disabled value="">
                      Genre
                    </option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
              </div>
              <div className="input" data-aos="fade-down-right">
                <label htmlFor="age">Age</label>
                <div className="input-area">
                  <i>
                    <CalendarMonthOutlinedIcon fontSize="small" />
                  </i>
                  <input
                    max={100}
                    type="number"
                    placeholder="Entre Votre age"
                    id="age"
                    name="age"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input" data-aos="fade-down-left">
              <label htmlFor="pass">Mot de passe</label>
              <div className="input-area">
                <i>
                  <LockOutlinedIcon fontSize="small" />
                </i>
                <input
                  type={visibility ? "text" : "password"}
                  placeholder="Entre Votre mot de passe"
                  id="pass"
                  name="password"
                  onChange={handleChange}
                  required
                />
                {visibility ? (
                  <i className="eye" onClick={() => setVisibility(!visibility)}>
                    <VisibilityOffIcon />
                  </i>
                ) : (
                  <i className="eye" onClick={() => setVisibility(!visibility)}>
                    <VisibilityIcon />
                  </i>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} data-aos="fade-down-right">
              {loading ? "Loading..." : "Enregistrer"}
            </button>
          </form>
          {passwordErr && <p style={{ color: "red" }}>{passwordErr}</p>}
          <p>
            Vous avez deja un compte?{" "}
            <span onClick={() => navigate("/login")}>Se connecter</span>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
