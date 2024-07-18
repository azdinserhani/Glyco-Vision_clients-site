import { useEffect, useState } from "react";
import "./Tension.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

import LineChart from "../chart/Chart";
const Tonsion = () => {
  const [classification, setClass] = useState("");
  const [catégorie, setCatégorie] = useState("");
  const [inputs, setInputs] = useState({
    value: "",
    date: "",
  });
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const handleCatégorieChange = (e) => {
    setCatégorie((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handlechange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (name === "value") {
      chekClass(value, catégorie);
    }
  };

  function chekClass(value, catégorie) {
    // console.log(value);
    console.log(catégorie.catégorie);
    if (catégorie.catégorie === "SYSTOLIQUE") {
      if (value < 120) {
        setClass("NORMAL");
      } else if (value > 120 && value <= 129) {
        setClass("ÉLEVÉE");
      } else if (value > 130 && value <= 139) {
        setClass("HYPERTENSION ARTÉRIELLE (STADE 1)");
      } else if (value > 140) {
        setClass("HYPERTENSION ARTÉRIELLE (STADE 2)");
      } else if (value > 180) {
        setClass("CRISE HYPERTENSIVE");
      }
    } else if (catégorie.catégorie === "DIASTOLIQUE") {
      if (value < 80) {
        setClass("NORMAL");
      } else if (value === 80) {
        setClass("ÉLEVÉE");
      } else if (value > 80 && value <= 89) {
        setClass("HYPERTENSION ARTÉRIELLE (STADE 1)");
      } else if (value > 90) {
        setClass("HYPERTENSION ARTÉRIELLE (STADE 2)");
      } else if (value > 120) {
        setClass("CRISE HYPERTENSIVE");
      }
    }
  }
  const queryClient = useQueryClient();

  //adding Read
  const mutation = useMutation({
    mutationFn: async (newRead) => {
      return await makeRequest.post("/api/addTension", newRead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["readingTension"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(inputs, classification);
    mutation.mutate({
      value: inputs.value,
      date: inputs.date,
      classification: classification,
    });
    setInputs({
      value: "",
      date: "",
    });
  };
  //remove all read
  const mutationDelete = useMutation({
    mutationFn: async () => {
      return await makeRequest.post("/api/deleteTension");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["readingTension"]);
    },
  });

  const handleClickdelete = async () => {
    mutationDelete.mutate();
  };

  const { isLoading, err, data } = useQuery({
    queryKey: ["readingTension"],
    queryFn: async () => {
      try {
        const res = await makeRequest.get("/api/getTension");
        console.log(res.data.data);
        return res.data.data;
      } catch (err) {
        console.log(err);
      }
    },
  });
  const dataChart = {
    labels:
      data &&
      data.map((item) => new Date(item.reading_date).toLocaleDateString()),
    datasets: [
      {
        label: "Mesurer la Tension",
        data: data && data.map((item) => item.reading_value),
        fill: false,
        backgroundColor: "rgb(29, 83, 89)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgb(48, 166, 173)",
          font: {
            size: 25,
          },
        },
      },
    },
    y: {
      ticks: {
        color: "rgb(48, 166, 173)",
        font: {
          size: 25,
        },
      },
    }
  };
  return (
    <div className="track-tension">
      <h2 data-aos="fade-up">Mesurer la Tension</h2>
      <div className="track-sugar">
        <div className="left" data-aos="fade-up">
          <form onSubmit={handleClick}>
            <div className="input" data-aos="fade-down-right">
              <p>Entrez la valeur:</p>
              <input
                min={50}
                max={200}
                type="number"
                placeholder="Tension"
                name="value"
                value={inputs.value}
                onChange={handlechange}
              />
              <span>mm/Hg</span>
            </div>
            <div className="input" data-aos="fade-down-left">
              <p>Date de mesure: </p>
              <input
                required
                type="date"
                placeholder="Entre Date de mesure"
                name="date"
                value={inputs.date}
                onChange={handlechange}
              />
            </div>
            <div className="input" data-aos="fade-down-left">
              <p>Catégorie de tension : </p>
              <select
                name="catégorie"
                required
                onChange={handleCatégorieChange}
              >
                <option value="" disabled>
                  catégorie de tension
                </option>
                <option value={"SYSTOLIQUE"}>SYSTOLIQUE</option>
                <option value={"DIASTOLIQUE"}>DIASTOLIQUE</option>
              </select>
            </div>
            <div className="input" data-aos="fade-down-right">
              <p>Class: </p>
              <input
                type="text"
                placeholder="class"
                value={classification}
                name="classification"
              />
            </div>
            <button type="submit" data-aos="fade-down-left">
              Enregistre
            </button>
          </form>
        </div>
        <div className="right">
          <div className="head">
            <h3>histoire</h3>
            <p onClick={handleClickdelete}>Effacet tout</p>
          </div>

          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <div className="history" key={index}>
                <p data-aos="fade-up">
                  {item.reading_value} mm/Hg{" "}
                  <span>
                    {new Date(item.reading_date).toLocaleDateString()}
                  </span>
                </p>

                <hr data-aos="fade-up" />
              </div>
            ))
          ) : (
            <p>Pas de données disponibles</p>
          )}
        </div>
      </div>
      <div className="sugar-chart">
        <h2>Graphique:</h2>

        <LineChart data={dataChart} options={options} />
      </div>
    </div>
  );
};

export default Tonsion;
