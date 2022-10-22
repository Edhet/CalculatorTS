var resultHtml = document.getElementById("result");
var firstValue, secondValue, resultValue;
var tempValue = "";
var operation = "";
var keep = false;
var displayValue = "";
function readInputButton(valueInput) {
    tempValue = tempValue + valueInput;
    displayValue = (displayValue == "0" || displayValue == "Infinity" || displayValue == "NaN") ? valueInput : displayValue + valueInput;
    updateResult();
}
function readOperationButton(operationInput) {
    if (operation == "") {
        if (tempValue != "") {
            firstValue = parseFloat(tempValue);
        }
        tempValue = "";
        displayValue = displayValue + operationInput;
        operation = operationInput;
        updateResult();
    }
}
function calculateResult() {
    secondValue = parseFloat(tempValue);
    tempValue = "";
    switch (operation) {
        case '/':
            resultValue = firstValue / secondValue;
            break;
        case '*':
            resultValue = firstValue * secondValue;
            break;
        case '+':
            resultValue = firstValue + secondValue;
            break;
        case '-':
            resultValue = firstValue - secondValue;
            break;
    }
    keep = true;
    firstValue = resultValue;
    displayValue = resultValue.toString();
    operation = "";
    updateResult();
}
function clearDisplayButton() {
    displayValue = "0";
    firstValue = 0;
    secondValue = 0;
    tempValue = "";
    operation = "";
    updateResult();
}
function updateResult() {
    resultHtml.innerHTML = displayValue;
}
