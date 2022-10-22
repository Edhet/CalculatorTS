const resultHtml = document.getElementById("result");

let firstValue: number, secondValue: number, resultValue: number;
let tempValue = "";
let operation = "";

let keep = false;
let displayValue = "";


function readInputButton(valueInput: string): void {
    tempValue = tempValue + valueInput;
    displayValue = (displayValue == "0" || displayValue == "Infinity" || displayValue == "NaN") ? valueInput : displayValue + valueInput;
    updateResult();
}

function readOperationButton(operationInput: string): void {
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

function calculateResult(): void {
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

function clearDisplayButton(): void {
    displayValue = "0";
    firstValue = 0;
    secondValue = 0;
    tempValue = "";
    operation = "";
    updateResult();
}

function updateResult(): void {
    resultHtml!.innerHTML = displayValue;
}
