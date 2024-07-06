from flask import Flask, request, jsonify, send_from_directory
import requests
from dotenv import load_dotenv
import os
from translate import translate_to_english
import logging

logging.basicConfig(level=logging.DEBUG)

# .env 파일에서 환경 변수 로드
load_dotenv()

# DALL-E API 키 설정
API_KEY = os.getenv('API_KEY')

if not API_KEY:
  raise ValueError("API key not found. Please set the API key in the .env file.")

app = Flask(__name__, static_folder='../client', static_url_path='')

# DALL-E API endpoint 설정
API_URL = os.getenv('API_URL')

@app.route('/')
def serve_index():
  return send_from_directory(app.static_folder, 'index.html')

@app.route('/generate', methods=['POST'])
def generate_image():
  try:
    data = request.get_json()
    prompt = data.get('prompt')

    # 한글 프롬프트를 영어로 번역
    english_prompt = translate_to_english(prompt)
    print(f'english_prompt ::::::: {english_prompt}')

    headers = {
      'Authorization': f'Bearer {API_KEY}',
      'Content-Type': 'application/json'
    }
    payload = {
      'prompt': english_prompt,
      'size': '256x256',
      'n': 1
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
      result = response.json()
      logging.debug(f"API Response: {result}")
      if 'data' in result and len(result['data']) > 0:
        image_url = result['data'][0]['url']
        return jsonify({'image_url': image_url})
      else:
        return jsonify({'error': 'No image data returned'}), 500
    else:
      # API 응답에서 에러 메시지 추출
      error_response = response.json()
      logging.debug(f"API Error Response: {error_response}")
      return jsonify({'error': error_response.get('error', {}).get('message', 'Unknown error')}), response.status_code
  except Exception as e:
    logging.error(f"Exception: {str(e)}")
    return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
  app.run(debug=True)