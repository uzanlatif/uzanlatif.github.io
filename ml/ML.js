async function loadModel() {
  const modelUrl = 'theModel/model.json';
  const model = await tf.loadLayersModel(modelUrl);

  const inputElement = document.getElementById('input-image');
  const img = new Image();

  img.onload = async () => {
    // Show loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block';
    const outputContainer = document.getElementById('output-container');
    outputContainer.classList.add('loading');

    const prediction = model.predict(tf.expandDims(tf.image.resizeBilinear(tf.browser.fromPixels(img), [100, 100]), 0));
    const predictionValue = await prediction.data();
    console.log("pred " + predictionValue);
    const predictedClassElement = document.createElement('h1');
    const predictTextElement = document.createElement('h1');

    const predictedClass = predictionValue[0] > 0.5? 'dog' : 'cat';

    predictedClassElement.innerText = `Predicted class: ${predictedClass}`;
    predictTextElement.innerText = `Predicted value: ${predictionValue}`;

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
