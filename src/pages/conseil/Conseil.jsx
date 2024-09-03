import { useEffect, useState } from "react";
import "./Consiel.scss";
import Select from "react-select";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {motion} from "framer-motion"

const Conseil = () => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({
    sexe: "",
    age: "",
  });
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const scrollToConsiel = () => {
    document
      .querySelector(".data-conseil")
      .scrollIntoView({ behavior: "smooth" });
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#00bcd4" : "#00bcd4",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 188, 212, 0.2)" : null,
      "&:hover": {
        borderColor: "#00bcd4",
      },
      borderRadius: "25px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#b3b3b3",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      fontSize: "25px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#00bcd4" : "#ffffff",
      color: state.isFocused ? "#ffffff" : "#000000",
      "&:hover": {
        backgroundColor: "#00bcd4",
        color: "#ffffff",
      },
    }),
  };

  const authTocken = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://sandbox-healthservice.priaid.ch/symptoms?token=" +
            authTocken +
            "&format=json&language=fr-fr"
        );
        const symptomOptions = res.data.map((symptom) => ({
          value: symptom.ID,
          label: symptom.Name,
        }));
        setOptions(symptomOptions);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const handleChangeInputs = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(inputs);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://sandbox-healthservice.priaid.ch/diagnosis?symptoms=[${selectedOption.value}]&gender=${inputs.sexe}&year_of_birth=${inputs.age}&token=${authTocken}&format=json&language=fr-fr`
      );

      const issueId = res.data.map((item) => ({
        value: item.Issue.ID,
      }));

      const result = [];
      for (let i = 0; i < issueId.length; i++) {
        const res = await axios.get(
          `https://sandbox-healthservice.priaid.ch/issues/${issueId[i].value}/info?token=${authTocken}&format=json&language=fr-fr`
        );
        result.push(res.data);
      }
      setData(result);
      setInputs({
        age: "",
        sexe: "",
      });
      setSelectedOption(null);
      scrollToConsiel();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="conseil">
      <div className="head">
        <div className="container" data-aos="fade-up">
          <form onSubmit={handleClick}>
            <div className="input">
              <p>Entrez le symptôme</p>
              {options && (
                <Select
                  value={selectedOption}
                  onChange={handleChange}
                  options={options}
                  placeholder="Rechercher un symptôme"
                  isClearable
                  styles={customStyles}
                  className="select"
                />
              )}
            </div>

            <div className="input" data-aos="fade-down-left">
              <p>Genre</p>
              <select
                name="sexe"
                required
                onChange={handleChangeInputs}
                value={inputs.sexe}
              >
                <option value="" disabled>
                  Genre
                </option>
                <option value="Female">Femme</option>
                <option value="male">Homme</option>
              </select>
            </div>
            <div className="input" data-aos="fade-down-right">
              <p>Date de naissance </p>
              <input
                value={inputs.age}
                type="number"
                placeholder="Date de naissance"
                name="age"
                onChange={handleChangeInputs}
              />
            </div>
            <button type="submit" data-aos="fade-down-left">
              Soumettre Symptôme
            </button>
          </form>
        </div>
      </div>

      <div className="data-conseil">
        {data &&
          data.map((item, index) => (
            

            <div className="info" key={index} data-aos="fade-down-right">
              <div className="card">
                <h2>Nom:</h2>
                <p>{item.Name}</p>
              </div>
              <div className="card">
                <h2>Condition médicale:</h2>
                <p>{item.Description}</p>
              </div>
              <div className="card">
                <h2>Description:</h2>
                <p>{item.DescriptionShort}</p>
              </div>
              <div className="card">
                <h2>Symptômes possibles:</h2>
                <p>{item.PossibleSymptoms}</p>
              </div>
              <div className="card">
                <h2>Description du traitement:</h2>
                <p>{item.TreatmentDescription}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Conseil;
