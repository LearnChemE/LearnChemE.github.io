from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

@app.route('/data', methods=['POST'])
def handle_data():
    content = request.get_json()
    print(f"Received data: {content}")

    x = content.get('lift', [])
    y = content.get('deltaP', [])
    sv = [l * 6.5 for l in x]

    plt.plot(x, y, marker='o')
    plt.title('Data from Fluidized Bed Simulation')
    plt.xlabel('Lift')
    plt.ylabel('Pressure Drop (cm water)')
    plt.grid(True)
    plt.show()

    plt.plot(sv, y, marker='o')
    plt.title('Data from Fluidized Bed Simulation')
    plt.xlabel('Superficial Velocity (cm/s)')
    plt.ylabel('Pressure Drop (cm water)')
    plt.grid(True)
    plt.show()

    return jsonify({"status":"success", "message":"Data plotted"})

if __name__ == '__main__':
    app.run(debug=True)