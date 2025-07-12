from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

def calorie_goal_table(tdee):
    return [
        {
            "goal": "Extreme weight loss",
            "calories": round(tdee - 1000),
            "weekly_change_kg": -0.9
        },
        {
            "goal": "Moderate weight loss",
            "calories": round(tdee - 500),
            "weekly_change_kg": -0.45
        },
        {
            "goal": "Mild weight loss",
            "calories": round(tdee - 250),
            "weekly_change_kg": -0.23
        },
        {
            "goal": "Maintain weight",
            "calories": round(tdee),
            "weekly_change_kg": 0
        },
        {
            "goal": "Mild weight gain",
            "calories": round(tdee + 250),
            "weekly_change_kg": 0.23
        },
        {
            "goal": "Aggressive weight gain",
            "calories": round(tdee + 500),
            "weekly_change_kg": 0.45
        }
    ]



@app.route('/')
def home():
    return "CALORIE-DEFICIT"

@app.route('/message', methods=['POST'])
def message():
    data = request.json
    
    age = int(data["age"])
    height=float(data["height"])
    weight=float(data["weight"])
    gender=data["gender"]
    activity=int(data["activity"])
    
    print(f"Age:{age}")
    print(f"Height:{height}")
    print(f"Weight:{weight}")
    print(f"Gender:{gender}")
    print(f"Activity:{activity}")


    if gender == "female":
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else :
        bmr = 10 * weight + 6.25 * height - 5 * age + 5

    # if activity == 1:
    #     tdee = bmr * 1.0
    # elif activity == 2:
    #     tdee = bmr * 1.2
    # elif activity == 3:
    #     tdee = bmr * 1.375
    # elif activity == 4:
    #     tdee = bmr * 1.55
    # elif activity == 5:
    #     tdee = bmr * 1.725
    # elif activity == 6:
    #     tdee = bmr * 1.9
    # else:
    #     tdee = bmr * 2.0

    activity_map = {
        
        1:1.0,
        2: 1.2,
        3: 1.375,
        4: 1.55,
        5: 1.725,
        6: 1.9,
        7: 2.0
    }

    tdee = bmr * activity_map.get(activity)

    goals = calorie_goal_table(tdee)

    bmi = round((weight*10000) / (height**2),2)

    print("---------------------------------------------------")
    print(f"BMR: {bmr}")
    print(f"TDEE: {tdee}")
    print(f"BMI: {bmi}")


    return jsonify({
        "TDEE": tdee, 
        "goals": goals,
        "BMR": bmr,
        "BMI":bmi
    })  

# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True)
