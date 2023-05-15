async function loadModel() {
  // Show loading spinner
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.style.display = 'block';
  const outputContainer = document.getElementById('output-container');
  outputContainer.classList.add('loading');

  const modelUrl = 'theModel/model.json';
  const model = await tf.loadLayersModel(modelUrl);

  const inputElement = document.getElementById('input-image');
  const img = new Image();

  img.onload = async () => {
    const prediction = model.predict(tf.expandDims(tf.image.resizeBilinear(tf.browser.fromPixels(img), [224, 224]), 0));
    const predictionValue = await prediction.data();
    console.log("pred " + predictionValue);
    const predictedClassElement = document.createElement('h1');
    const predictTextElement = document.createElement('h1');

    const classes = ['low', 'normal', 'high', 'very high'];
    let maxIndex = 0;
    for (let i = 1; i < predictionValue.length; i++) {
      if (predictionValue[i] > predictionValue[maxIndex]) {
        maxIndex = i;
      }
    }
    const predictedClass = classes[maxIndex];

    predictedClassElement.innerText = `Predicted class: ${predictedClass}`;
    predictTextElement.innerText = `Prediction values: low - ${predictionValue[0]}, normal - ${predictionValue[1]}, high - ${predictionValue[2]}, very high - ${predictionValue[3]}`;

    // Hide loading spinner
    loadingSpinner.style.display = 'none';
    outputContainer.classList.remove('loading');

    outputContainer.appendChild(predictTextElement);
    outputContainer.appendChild(predictedClassElement);
    
  };
  img.src = URL.createObjectURL(inputElement.files[0]);
}

const formElement = document.querySelector('form');
const outputContainer = document.getElementById('output-container');
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  outputContainer.innerHTML = '';
  loadModel();
});
