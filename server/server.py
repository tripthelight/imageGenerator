from flask import Flask, request, jsonify, send_from_directory
import openai
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='../client', static_url_path='')

@app.route('/')
def serve_index():
  return send_from_directory(app.static_folder, 'index.html')

@app.route('/generate', methods=['POST'])
def generate_image():
  try:
    data = request.get_json()
    prompt = data.get('prompt')

    # Set the OpenAI API key
    client = OpenAI(
      api_key=os.environ['API_KEY'],  # this is also the default, it can be omitted
    )

    # Create an image using the latest method for DALL-E
    response = client.images.generate(
      model="dall-e-3",
      prompt=prompt,
      size="1024x1024",
      quality="standard",
      n=1,
    )

    image_url = response.data[0].url
    print(f'image_url ::::::: {image_url}')
    return jsonify({'image_url': image_url})

  except openai.APIError as e:
    #Handle API error here, e.g. retry or log
    print(f"OpenAI API returned an API Error: {e}")
    pass
  except openai.APIConnectionError as e:
    #Handle connection error here
    print(f"Failed to connect to OpenAI API: {e}")
    pass
  except openai.RateLimitError as e:
    #Handle rate limit error (we recommend using exponential backoff)
    print(f"OpenAI API request exceeded rate limit: {e}")
    pass

if __name__ == '__main__':
  app.run(debug=True)