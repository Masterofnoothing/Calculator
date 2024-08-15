from flask import Flask, jsonify,render_template,request
from flask_cors import CORS
from g4f.client import Client


app = Flask(__name__)

# Enable CORS for all routes
CORS(app)
memory = {}
@app.route('/')
def home():
    return render_template('main.html')

@app.route('/question', methods=['POST'])
def question():
    data = request.get_json()
    
    # Process the data (this is just an example)
    if not data:
        return jsonify({"error": "No data provided"}), 400
    

    if data['user'] not in memory:
        memory[data['user']] = []
    memory[data['user']].append({"role": "user", "content": data['message']}) 

    if len(memory[data['user']]) >= 10:
        memory[data['user']].pop(0)
    
    client = Client()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=memory[data['user']]
    )
    reply = response.choices[0].message.content
    memory[data['user']].append({"role": "assistant", "content": reply})
    
    return jsonify({'response':reply})


if __name__ == '__main__':
    app.run(debug=True)
