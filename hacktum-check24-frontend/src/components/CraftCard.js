import "./CraftCard.css";
import React, { useState, useEffect } from "react";
import TimeSlotPicker from "./TimeSlotPicker";

const CraftCard = (props) => {
  const [avatarFilename] = useState(() => randomAvatar());
  const [selectedDate, setSelectedDate] = useState("20,Oct");

  const handleConfirmClick = () => {
    props.onCloseModal();
    const SuccessModalContent = (
      <div className="success-modal">
        <div className="craftCard-name">Reserve success</div>
        <button className="craftCard-button" onClick={props.onCloseModal}>
          OK
        </button>
      </div>
    );
    props.onShowModal(SuccessModalContent);
  };

  const avatarSrc = `${process.env.PUBLIC_URL}/craftsmen-avatar/${avatarFilename}`;

  const handleDateSelect = (date) => {
    const newDate = date;
    setSelectedDate(newDate);
    console.log("Selected date:", newDate);
  };

  const handleTimeSelect = (time) => {
    console.log(time);
  };

  const modalContent = (
    <div className="modal">
      <div className="timeslot-choose-date">
        <button
          className={`timeslot ${selectedDate === "20,Oct" ? "selected" : ""}`}
          onClick={() => handleDateSelect("20,Oct")}
        >
          20,Oct
        </button>
        <button
          className={`timeslot ${selectedDate === "21,Oct" ? "selected" : ""}`}
          onClick={() => handleDateSelect("21,Oct")}
        >
          21,Oct
        </button>
        <button
          className={`timeslot ${selectedDate === "22,Oct" ? "selected" : ""}`}
          onClick={() => handleDateSelect("22,Oct")}
        >
          22,Oct
        </button>
      </div>

      <div className="timeslot-choose-container">
        <TimeSlotPicker onTimeSelect={handleTimeSelect} />
      </div>
      <div className="timeslot-choose-button-container">
        <button className="craftCard-button" onClick={props.onCloseModal}>
          cancel
        </button>
        <button className="craftCard-button" onClick={handleConfirmClick}>
          confirm
        </button>
      </div>
    </div>
  );

  const ShowTimeSlot = () => {
    props.onShowModal(modalContent);
  };

  return (
    <div className="craftCard-container">
      <div className="craftCard-header">
        <img src={avatarSrc} alt={props.name} className="craftCard-image" />
        <div className="text-info">
          <div className="craftCard-info">
            <div className="craftCard-name">{props.name} </div>
            <div className="craftCard-rank">
              <div className="small-title">Rank:</div>
              <div className="rank-score">{props.rankingScore} ⭐</div>
            </div>
          </div>
          <div className="craftCard-details">
            <span className="craftCard-distance">
              <div className="small-title">📍 Distance</div>
              <div className="distance-number">{randomDistance()}</div>
              <div className="small-title">km</div>
            </span>
            <span className="craftCard-bookings">
              <div className="distance-number">📘 {randomBookingNumber()}</div>{" "}
              <div className="small-title">Booking</div>
            </span>
          </div>
        </div>
      </div>
      <div className="reserve-button-Container">
        <button className="craftCard-button" onClick={ShowTimeSlot}>
          Reserve Now
        </button>
      </div>
    </div>
  );
};

function randomAvatar() {
  return Math.floor(Math.random() * 6) + 1 + ".png";
}

function randomDistance() {
  //range from 0.1 - 10
  return (Math.random() * 10).toFixed(1);
}

function randomBookingNumber() {
  //range from 1 - 200
  return Math.floor(Math.random() * 200) + 1;
}

export default CraftCard;