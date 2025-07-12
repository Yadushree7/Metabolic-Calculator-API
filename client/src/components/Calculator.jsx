import React, { useState } from "react";

const Calculator = () => {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("1");
  const [result, setResult] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      age: age,
      height: height,
      weight: weight,
      gender: gender,
      activity: activity,
    };

    try {
      const response = await fetch("http://loaclhost:5000/message", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="details">
          <label>AGE</label>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="number"
            className="age"
            min="15"
            max="80"
            required
            placeholder="15-80"
          />

          <label>HEIGHT</label>
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            type="number"
            className="height"
            placeholder="cm"
          />

          <label>WEIGHT</label>
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            type="number"
            className="weight"
            placeholder="kg"
          />
          <label>GENDER</label>
          <div className="gender-group">
            <label className="fem">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />
              FEMALE
            </label>
            <label className="ml">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />
              MALE
            </label>
          </div>

          <label>ACTIVITY</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="act"
          >
            <option value="1">Basal metabolic rate (BMR)</option>
            <option value="2">Sedentary: little to no exercise</option>
            <option value="3">Light: exercise 1-3times/week</option>
            <option value="4">Moderate: exercise 4-5 times/week</option>
            <option value="5">
              Active: daily exercise or intense exercise 4-5 times/week
            </option>
            <option value="6">
              Very-Active: intense exercise 6-7 times/week
            </option>
            <option value="7">
              Extra-Active: very intense exercise daily or physical job
            </option>
          </select>
        </div>
        <button className="sub-but" type="submit">
          Calculate
        </button>
      </form>
      <div className="result">
        {result && result.TDEE && result.BMR && (
          <>
            <h3>BASAL METABOLIC RATE(BMR): {result.BMR} kcal/day</h3>
            <h3>
              Total Daily Energy Expenditure(TDEE): {result.TDEE} kcal/day
            </h3>
            <h3>
              BODY MASS INDEX(BMI): {result.BMI} kgs/m<sup>2</sup>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>GOAL</th>
                  <th>CALORIES</th>
                  <th>WEEKLY-CHANGE</th>
                </tr>
              </thead>
              <tbody>
                {result.goals.map((item, index) => (
                  <tr key={index}>
                    <td>{item.goal}</td>
                    <td>{item.calories} kcal/day</td>
                    <td>{item.weekly_change_kg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Calculator;
