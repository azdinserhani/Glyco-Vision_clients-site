import React from 'react'

const Info = ({item,index}) => {
  return (
    <div>
      <div className="info" key={index} >
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
    </div>
  );
}

export default Info