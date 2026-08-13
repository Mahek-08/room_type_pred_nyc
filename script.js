const DEFAULT_API_BASE_URL = "https://nyc-airbnb-room-type-predictor.onrender.com";
const API_BASE_URL = window.location.protocol === "file:"
  ? DEFAULT_API_BASE_URL
  : (window.location.origin || DEFAULT_API_BASE_URL);

const PREDICT_ENDPOINT = `${API_BASE_URL}/predict`;
const HEALTH_ENDPOINT = `${API_BASE_URL}/`;
const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ROOM_CLASSES = [
  { key: "Entire home/apt", summary: "Best match for a full-property listing with more autonomy and privacy." },
  { key: "Private room", summary: "Best match for a listing where guests likely book one room within a larger home." },
  { key: "Shared room", summary: "Best match for a budget-oriented listing with shared sleeping space." },
];

const EXAMPLES = [
  {
    latitude: 40.7484,
    longitude: -73.9857,
    price: 210,
    minimum_nights: 3,
    number_of_reviews: 84,
    reviews_per_month: 2.3,
    calculated_host_listings_count: 1,
    availability_365: 210,
    neighbourhood_group: "Manhattan",
    neighbourhood: "Midtown",
  },
  {
    latitude: 40.6782,
    longitude: -73.9442,
    price: 68,
    minimum_nights: 1,
    number_of_reviews: 210,
    reviews_per_month: 4.1,
    calculated_host_listings_count: 3,
    availability_365: 300,
    neighbourhood_group: "Brooklyn",
    neighbourhood: "Bedford-Stuyvesant",
  },
  {
    latitude: 40.7282,
    longitude: -73.7949,
    price: 42,
    minimum_nights: 2,
    number_of_reviews: 12,
    reviews_per_month: 0.6,
    calculated_host_listings_count: 1,
    availability_365: 90,
    neighbourhood_group: "Queens",
    neighbourhood: "Flushing",
  },
];

let exampleIndex = 0;

const form = document.getElementById("predictForm");
const exampleBtn = document.getElementById("exampleBtn");
const availabilityInput = document.getElementById("availability_365");
const availabilityValue = document.getElementById("availabilityValue");
const predictBtn = document.getElementById("predictBtn");
const formError = document.getElementById("formError");
const resultEmpty = document.getElementById("resultEmpty");
const resultContent = document.getElementById("resultContent");
const predictedName = document.getElementById("predictedName");
const resultSummary = document.getElementById("resultSummary");
const probList = document.getElementById("probList");
const apiStatusCard = document.getElementById("apiStatusCard");
const apiStatusText = document.getElementById("apiStatusText");

availabilityInput.addEventListener("input", () => {
  availabilityValue.textContent = availabilityInput.value;
});

exampleBtn.addEventListener("click", () => {
  const example = EXAMPLES[exampleIndex % EXAMPLES.length];
  exampleIndex += 1;

  Object.entries(example).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value;
    }
  });

  availabilityValue.textContent = String(example.availability_365);
  formError.textContent = "";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";

  if (!form.reportValidity()) {
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(PREDICT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectPayload()),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(readApiError(body, response.status));
    }

    const result = await response.json();
    renderResult(result);
  } catch (error) {
    formError.textContent = error.message?.includes("fetch")
      ? "Prediction API is unreachable. Start the FastAPI server or update the API base URL in script.js."
      : (error.message || "Prediction failed. Check the form values and try again.");
  } finally {
    setLoading(false);
  }
});

function collectPayload() {
  const data = new FormData(form);
  return {
    latitude: parseFloat(data.get("latitude")),
    longitude: parseFloat(data.get("longitude")),
    price: parseFloat(data.get("price")),
    minimum_nights: parseInt(data.get("minimum_nights"), 10),
    number_of_reviews: parseInt(data.get("number_of_reviews"), 10),
    reviews_per_month: parseFloat(data.get("reviews_per_month")),
    calculated_host_listings_count: parseInt(data.get("calculated_host_listings_count"), 10),
    availability_365: parseInt(data.get("availability_365"), 10),
    neighbourhood_group: data.get("neighbourhood_group"),
    neighbourhood: data.get("neighbourhood"),
  };
}

function readApiError(body, status) {
  if (Array.isArray(body?.detail)) {
    return body.detail.map((item) => item.msg || JSON.stringify(item)).join(" ");
  }

  if (typeof body?.detail === "string") {
    return body.detail;
  }

  return `Request failed with status ${status}.`;
}

function setLoading(isLoading) {
  predictBtn.disabled = isLoading;
  predictBtn.classList.toggle("loading", isLoading);
}

function renderResult(result) {
  const predicted = result.Predicted_room_type;
  const probability = Array.isArray(result.Probability) ? result.Probability : [];

  const rows = ROOM_CLASSES.map((item, index) => ({
    ...item,
    probability: typeof probability[index] === "number" ? probability[index] : 0,
  })).sort((a, b) => b.probability - a.probability);

  const lead = rows.find((row) => row.key === predicted) || rows[0];

  resultEmpty.hidden = true;
  resultContent.hidden = false;
  predictedName.textContent = predicted || "Unknown";
  resultSummary.textContent = lead?.summary || "Prediction received from the model.";

  probList.innerHTML = "";

  rows.forEach((row, index) => {
    const percentage = Math.round(row.probability * 100);
    const article = document.createElement("article");
    article.className = `confidence-row${row.key === predicted ? " is-top" : ""}`;

    const head = document.createElement("div");
    head.className = "confidence-head";

    const name = document.createElement("span");
    name.className = "confidence-name";
    name.textContent = row.key;

    const score = document.createElement("span");
    score.className = "confidence-score";
    score.textContent = REDUCE_MOTION ? `${percentage}%` : "0%";

    const track = document.createElement("div");
    track.className = "confidence-track";

    const fill = document.createElement("div");
    fill.className = "confidence-fill";
    track.appendChild(fill);

    head.append(name, score);
    article.append(head, track);
    probList.appendChild(article);

    requestAnimationFrame(() => {
      const delay = REDUCE_MOTION ? 0 : index * 120;
      window.setTimeout(() => {
        fill.style.width = `${percentage}%`;
        animateNumber(score, percentage);
      }, delay);
    });
  });
}

function animateNumber(element, target) {
  if (REDUCE_MOTION) {
    element.textContent = `${target}%`;
    return;
  }

  const start = performance.now();
  const duration = 700;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}%`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

async function checkApiStatus() {
  try {
    const response = await fetch(HEALTH_ENDPOINT, { method: "GET" });

    if (!response.ok) {
      throw new Error("health check failed");
    }

    apiStatusCard.classList.add("is-online");
    apiStatusCard.classList.remove("is-offline");
    apiStatusText.textContent = "Connected";
  } catch {
    apiStatusCard.classList.add("is-offline");
    apiStatusCard.classList.remove("is-online");
    apiStatusText.textContent = "Unavailable";
  }
}

checkApiStatus();
