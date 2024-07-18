import "./Login.scss";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { ThreeDots } from "react-loader-spinner";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Aos from "aos";
import "aos/dist/aos.css";
const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    Aos.init({
      duration: 1500,
      once: true,
    });
  });
  const [visibility, setVisibility] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, status } = useContext(AuthContext);
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(inputs);

      setLoading(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(err);
      setLoading(false);
    }
  };
  
  return (
    <div className="login">
      <div className="container">
        <div className="logo">
          <img
            src="../../../public/logo.ico"
            alt=""
            data-aos="fade-down-left"
          />
        </div>
        <div className="info">
          <form onSubmit={handleClick}>
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
                  required={true}
                />
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
                  required={true}
                  aria-required={"true"}
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
              {loading ? (
                <div className="spinner">
                  <ThreeDots color="white" height={30} width={50} />
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
          <p data-aos="fade-down-left">
            Vous n'avez pas de compte?
            <span onClick={() => navigate("/register")}> s'inscrire</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
