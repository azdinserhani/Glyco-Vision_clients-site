import { useEffect, useState } from "react";
import "./Sugar.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import Chart, { Colors, scales, Ticks } from "chart.js/auto";
import LineChart from "../../components/chart/Chart";
import Tonsion from "../../components/TensionPart/Tension";
const Sugar = () => {
  const [classification, setClass] = useState("");
  const [inputs, setInputs] = useState({
    value: "",
    date: "",
  });
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const handlechange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    if (name === "value") {
      chekClass(value);
    }
  };

  function chekClass(value) {
    if (value < 1.1 && value >= 0.7) {
      setClass("Glycémie à jeun normale ");
    } else if (value > 1.1 && value <= 1.25) {
      setClass("Pré-diabète à jeun ");
    } else if (value > 1.26) {
      setClass("Diabète à jeun");
    }
  }
  const queryClient = useQueryClient();

  //adding Read
  const mutation = useMutation({
    mutationFn: async (newRead) => {
      return await makeRequest.post("/api/addSugar", newRead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reading"]);
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
      return await makeRequest.post("/api/deleteSugar");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reading"]);
    },
  });

  const handleClickdelete = async () => {
    mutationDelete.mutate();
  };

  const { isLoading, err, data } = useQuery({
    queryKey: ["reading"],
    queryFn: async () => {
      try {
        const res = await makeRequest.get("/api/getSugar");
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
        label: "Mesurer la glycémie",
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
    },
  };
  return (
    <div className="track">
      <h2 data-aos="fade-up">Mesurer la glycémie</h2>
      <div className="track-sugar">
        <div className="left" data-aos="fade-up">
          <form onSubmit={handleClick}>
            <div className="input" data-aos="fade-down-right">
              <p>Entrez la valeur:</p>
              <input
                min={0}
                max={5}
                type="number"
                step={0.01}
                placeholder="Glycémie"
                name="value"
                value={inputs.value}
                onChange={handlechange}
              />
              <span>g/l</span>
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
                  {item.reading_value} mg/dl{" "}
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

export default Sugar;
