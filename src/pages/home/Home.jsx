import "./Home.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { useNavigate,useLocation} from "react-router-dom";
const Home = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const scrollToConsiel = () => {
    document.querySelector(".consiel").scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    Aos.init({
      duration: 1500,
      once: true,
    });
  });
  const navigation = useNavigate();
  return (
    <div className="home">
      <div className="hero">
        <p data-aos="zoom-in">
          Surveillez votre santé et restez informé de votre état de santé
        </p>
        <button data-aos="zoom-in-up" onClick={scrollToConsiel}>
          commencez maintenant
        </button>
      </div>
      <div className="consiel">
        <div className="left">
          <h2 data-aos="fade-down-right">Conseil</h2>
          <p data-aos="fade-down-left">
            Obtenez des conseils adaptés à votre état de santé
          </p>
          <button
            data-aos="fade-down-right"
            onClick={() => navigation("/conseil")}
          >
            Conseils sur mesure
          </button>
        </div>
        <div className="right">
          <img
            src="../../../public/consiel.jpg"
            alt=""
            data-aos="zoom-in-up"
          ></img>
          
        </div>
      </div>
      <div className="suivi">
        <h2 data-aos="zoom-in-up">Enregistrez vos niveaux de sucre </h2>
        <div className="info">
          <div className="left">
            <img
              src="../../../public/chart.PNG"
              alt=""
              data-aos="fade-down-right"
            />
          </div>
          <div className="right">
            <p data-aos="fade-down-left">
              Commencez à suivre votre glycémie dès aujourd’hui
            </p>
            <button
              onClick={() => navigation("/suivi")}
              data-aos="fade-down-right"
            >
              Commencer le suivi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
