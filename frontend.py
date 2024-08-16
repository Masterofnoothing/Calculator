from flask import Flask, jsonify,render_template,request
from flask_cors import CORS
from g4f.client import Client

import json
import random
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)
memory = {}
user_data = {}
@app.route('/')
def home():
    return render_template('main.html')

@app.route('/question', methods=['POST'])
def question():
    data = request.get_json()
    
    # Process the data (this is just an example)
    if not data:
        return jsonify({"error": "No data provided"}), 400
    

    if data['user_id'] not in memory:
        memory[data['user_id']] = []
    memory[data['user_id']].append({"role": "user_id", "content": data['message']}) 

    if len(memory[data['user_id']]) >= 10:
        memory[data['user_id']].pop(0)
    
    client = Client()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=memory[data['user_id']]
    )
    reply = response.choices[0].message.content
    memory[data['user_id']].append({"role": "assistant", "content": reply})
    
    return jsonify({'response':reply})


# Load riddles from the JSON file
def load_riddles():
    with open('riddles.json', 'r') as file:
        return json.load(file)



@app.route('/get_riddle', methods=['POST'])
def get_riddle():
    user_id = request.json.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    riddles = load_riddles()
    asked_riddle = random.choice(riddles)
    
    # Store the user ID and riddle in the dictionary
    user_data[user_id] = {
        "riddle_asked": asked_riddle['question'],
        "answer": asked_riddle['answer']
    }
    
    return jsonify({"response": asked_riddle['question']}), 200

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    user_id = request.json.get('user_id')
    answer = request.json.get('message')
    
    if not user_id or not answer:
        return jsonify({"error": "user_id ID and answer are required"}), 400
    
    if user_id not in user_data:
        data = request.get_json()
        
        # Process the data (this is just an example)
        if not data:
            return jsonify({"error": "No data provided"}), 400
        

        if data['user_id'] not in memory:
            memory[data['user_id']] = []
        memory[data['user_id']].append({"role": "user_id", "content": data['message']}) 

        if len(memory[data['user_id']]) >= 10:
            memory[data['user_id']].pop(0)
        
        client = Client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=memory[data['user_id']]
        )
        reply = response.choices[0].message.content
        memory[data['user_id']].append({"role": "assistant", "content": reply})
        
        return jsonify({'response':reply})
    
    correct_answer = user_data[user_id]["answer"]
    
    if answer.strip().lower() == correct_answer.lower():
        result = "Correct!"
    else:
        result = f"Wrong! The correct answer was: {correct_answer}"
    
    # Clean up user_id data after answer is submitted
    del user_data[user_id]
    
    return jsonify({"response": result}), 200


if __name__ == '__main__':
    app.run(debug=True)
