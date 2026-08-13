# NYC Airbnb Room Type Predictor

A machine learning-powered web application that predicts the type of Airbnb listing (entire home, private room, or shared room) based on listing features and characteristics.

## 🎯 Overview

This project combines a trained machine learning model with a modern web interface to help predict NYC Airbnb room types. The application analyzes listing signals such as location, pricing, availability, and review patterns to classify listings into their room type categories.

## 📋 Features

- **Room Type Classification**: Predicts whether a listing is an entire home, private room, or shared room
- **10 Input Features**: Analyzes location (latitude/longitude), pricing, minimum nights, reviews, host information, and availability
- **Real-time Predictions**: Fast API-powered backend for instant predictions
- **Interactive Web Interface**: User-friendly UI to test predictions and compare model confidence
- **Sample Listings**: Pre-loaded example data for quick testing
- **API Status Monitoring**: Check backend connectivity from the UI

## 🏗️ Project Structure

```
NYC MAIN/
├── main.py                          # FastAPI backend server
├── nyc_airbnb_room_type_classification.ipynb  # Jupyter notebook with model training
├── Model_Pipeline.pkl               # Pre-trained ML model pipeline
├── index.html                       # Frontend UI
├── script.js                        # Frontend JavaScript
├── style.css                        # Frontend styling
├── requirements.txt                 # Python dependencies
└── README.md                        # This file
```

## 🔧 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd NYC\ MAIN
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Running the Application

### Start the Backend Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Access the Frontend

Open `index.html` in your web browser or serve it through a local web server:

```bash
# Using Python 3
python -m http.server 8001

# Then visit http://localhost:8001
```

## 📊 Input Features

The model accepts the following 10 features for prediction:

| Feature | Description | Range |
|---------|-------------|-------|
| **latitude** | Geographic latitude coordinate | -90 to 90 |
| **longitude** | Geographic longitude coordinate | -180 to 180 |
| **price** | Nightly price in USD | > 0 |
| **minimum_nights** | Minimum night stay requirement | 1 to 365 |
| **number_of_reviews** | Total review count | ≥ 0 |
| **reviews_per_month** | Average monthly reviews | ≥ 0 |
| **calculated_host_listings_count** | Number of listings by host | ≥ 0 |
| **availability_365** | Days available per year | 0 to 365 |
| **neighbourhood_group** | Borough or neighbourhood group | Text |
| **neighbourhood** | Specific neighbourhood name | Text |

## 🤖 Model Details

- **Model Type**: Scikit-learn Pipeline (Trained classification model)
- **Output Classes**: Entire Home, Private Room, Shared Room
- **Serialization**: Joblib (.pkl format)
- **Location**: `Model_Pipeline.pkl`

## 🔌 API Endpoints

### GET `/`
Returns a greeting message to verify API connectivity.

**Response:**
```
"Hello Guyss"
```

### POST `/predict`
Predicts the room type based on listing features.

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "price": 150.0,
  "minimum_nights": 1,
  "number_of_reviews": 25,
  "reviews_per_month": 2.5,
  "calculated_host_listings_count": 3,
  "availability_365": 180,
  "neighbourhood_group": "Manhattan",
  "neighbourhood": "Midtown"
}
```

**Response:**
```json
{
  "prediction": "Entire Home",
  "probability": {
    "Entire Home": 0.85,
    "Private Room": 0.10,
    "Shared Room": 0.05
  }
}
```

## 💻 Technology Stack

- **Backend**: FastAPI (Python)
- **Machine Learning**: Scikit-learn, Joblib
- **Data Processing**: Pandas
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API Server**: Uvicorn
- **Data Validation**: Pydantic
- **CORS**: Enabled for cross-origin requests

## 📦 Dependencies

- `fastapi==0.115.6` - Web framework
- `uvicorn[standard]==0.34.0` - ASGI server
- `pydantic==2.10.4` - Data validation
- `pandas==2.2.3` - Data manipulation
- `scikit-learn==1.6.1` - Machine learning
- `joblib==1.4.2` - Model serialization

## 📝 Usage Example

1. Start the backend: `uvicorn main:app --reload`
2. Open `index.html` in your browser
3. Enter listing details in the form
4. Click "Predict" to get the room type classification
5. View confidence scores for each room type category

## 🔒 Security Features

- CORS middleware enabled for cross-origin requests
- Input validation using Pydantic models
- Field constraints (latitude bounds, positive prices, etc.)

## 📈 Model Training

The machine learning model was trained using the notebook `nyc_airbnb_room_type_classification.ipynb`. This notebook contains:
- Data preprocessing and exploration
- Feature engineering
- Model training and evaluation
- Model serialization

To retrain the model, modify and run the notebook, then save the updated pipeline as `Model_Pipeline.pkl`.

## 🐛 Troubleshooting

### API Connection Issues
- Ensure the FastAPI server is running with `uvicorn main:app --reload`
- Check that port 8000 is not in use
- Verify CORS is properly configured

### Model Not Found
- Ensure `Model_Pipeline.pkl` is in the same directory as `main.py`
- Check file path and permissions

### Frontend Not Loading
- Verify you're accessing the file through a web server (not directly)
- Check browser console for JavaScript errors
- Ensure `style.css` and `script.js` are in the same directory

## 🤝 Contributing

Feel free to improve this project by:
- Enhancing the model accuracy
- Adding more features to the prediction form
- Improving the UI/UX
- Adding error handling and logging

## 📄 License

This project is provided as-is for educational and development purposes.

## 📧 Support

For issues or questions, please check:
1. The Jupyter notebook for model details
2. FastAPI documentation: https://fastapi.tiangolo.com/
3. Scikit-learn documentation: https://scikit-learn.org/

---

**Happy predicting!** 🏠✨
