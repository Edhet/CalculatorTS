const resultHtml = document.getElementById("result");

let fullExpression: string = "0";

function clearDisplayButton(): void {
    fullExpression = "0";
    updateHtml();
}

function readInputButton(valueInput: string): void {
    console.log("Pressed: "+valueInput)

    if (valueInput == ')' && !fullExpression.includes('('))
        return;
    if (valueInput == '(' && isNumeric(fullExpression[fullExpression.length - 1]) && fullExpression[fullExpression.length - 1] != '0')
        fullExpression += '*';


    if (fullExpression == "0" || fullExpression == "Error")
        fullExpression = valueInput;
    else
        fullExpression += valueInput;
    multiplyNumberAfterParenthesis();

    updateHtml();

}

function readOperationButton(operationInput: string): void {
    console.log("Pressed: "+operationInput)

    if (!isNumeric(fullExpression[fullExpression.length - 1]) && fullExpression[fullExpression.length - 1] != '(' &&  fullExpression[fullExpression.length - 1] != ')')
        return;

    fullExpression += operationInput;
    updateHtml();
}

function calculateResult() {
    removeUselessOperations();
    while (howManyParenthesisOpen() > 0)
        fullExpression += ')';
    console.log("Input: "+fullExpression);
    fullExpression = evaluateExpression(fullExpression);
    console.log("Result: "+fullExpression);
    updateHtml();
}

function evaluateExpression(expression: string): string {

    if (!expression.includes('+') && !expression.includes('*') && !expression.includes('/') && !expression.includes('(') && !expression.includes(')') && howManyNumbersInExpression(expression) == 1)
        return expression;

    while (expression.includes('(') && expression.includes(')')) {
        let startIndex = 0, endIndex = 0;

        for (let index = 0; index < expression.length; index++) {
            if (expression[index] == '(')
                startIndex = index;
            if (expression[index] == ')')
                endIndex = index;
            if (endIndex != 0 && endIndex > startIndex)
                break;
        }

        console.log("Evaluating sub-expression...");
        let subExpressionResult = evaluateExpression(expression.slice(startIndex + 1, endIndex));
        expression = expression.slice(0, startIndex) + subExpressionResult + expression.slice(endIndex + 1, expression.length);
    }

    while (expression.includes('*') || expression.includes('/')) {
        let firstIndexOne = 0, finalIndexOne = 0,
            firstIndexTwo = 0, finalIndexTwo = 0;
        let firstNumber = "", secondNumber = "";

        for (let char = 0; char < expression.length; char++) {
            if (!isNumeric(expression[char - 1]) || char == 0)
                firstIndexOne = char;

            if (expression[char] == '*') {
                finalIndexOne = char;
                firstNumber = expression.slice(firstIndexOne, finalIndexOne);
                firstIndexTwo = char + 1;
                for (let forwardChar = char + 1; forwardChar < expression.length; forwardChar++) {
                    if (!isNumeric(expression[forwardChar]) || forwardChar == expression.length - 1) {
                        finalIndexTwo = (forwardChar == expression.length - 1) ? forwardChar + 1 : forwardChar;
                        secondNumber = expression.slice(firstIndexTwo, finalIndexTwo);
                        if (secondNumber == '.')
                            secondNumber = '0';
                        let result: number = Number(firstNumber) * Number(secondNumber);
                        expression = expression.slice(0, firstIndexOne) + result.toString() + expression.slice(finalIndexTwo, expression.length);
                        break;
                    }
                }
                break;
            }
            if (expression[char] == '/') {
                finalIndexOne = char;
                firstNumber = expression.slice(firstIndexOne, finalIndexOne);
                firstIndexTwo = char + 1;
                for (let forwardChar = char + 1; forwardChar < expression.length; forwardChar++) {
                    if (!isNumeric(expression[forwardChar]) || forwardChar == expression.length - 1) {
                        finalIndexTwo = (forwardChar == expression.length - 1) ? forwardChar + 1 : forwardChar;
                        secondNumber = expression.slice(firstIndexTwo, finalIndexTwo);
                        if (secondNumber == '.' || Number(secondNumber) == 0)
                            return "Error";
                        let result: number = Number(firstNumber) / Number(secondNumber);
                        expression = expression.slice(0, firstIndexOne) + result.toString() + expression.slice(finalIndexTwo, expression.length);
                        break;
                    }
                }
                break;
            }
        }
    }

    while (howManyNumbersInExpression(expression) > 1) {
        let firstNumber = "", secondNumber = "";
        for (let char = 0; char < expression.length; char++) {
            if (expression[char] == '+' || (expression[char] == '-' && howManyNumbersInExpression(expression) > 1) && char != 0) {
                if (expression[char] == '-' && howManyNumbersInExpression(expression) > 1)
                    secondNumber += expression[char];

                for (let forwardChar = char + 1; forwardChar < expression.length; forwardChar++) {
                    if (isNumeric(expression[forwardChar]))
                        secondNumber += expression[forwardChar];

                    if (!isNumeric(expression[forwardChar]) || forwardChar == expression.length - 1) {
                        let result: number = Number(firstNumber) + Number(secondNumber);
                        expression = (forwardChar == expression.length - 1) ? result.toString() : result.toString() + expression.slice(forwardChar, expression.length);
                        break;
                    }
                }

                break;
            }
            firstNumber += expression[char];
        }
    }
    return expression;
}

function howManyNumbersInExpression(expression: string): number {
    let numbers = 0;
    let countedOne = false;
    for (let char = 0; char < expression.length; char++) {
        if (!isNumeric(expression[char]) && countedOne)
            countedOne = false;
        if ((isNumeric(expression[char]) || expression[char] == '-') && !countedOne) {
            countedOne = true;
            numbers++;
        }
    }
    return numbers;
}

function howManyParenthesisOpen(): number {
    if (!fullExpression.includes('('))
        return 0;
    let openParenthesis = 0;
    for (let char = 0; char < fullExpression.length; char++) {
        if (fullExpression[char] == '(')
            openParenthesis++;
        if (fullExpression[char] == ')')
            openParenthesis--;
    }
    return openParenthesis;
}

function isNumeric(char: string): boolean {
    if (char == '.') return true;
    return !isNaN(Number(char));
}

function removeUselessOperations(): void {
    for (let char = 0; char < fullExpression.length; char++)
        if (!isNumeric(fullExpression[char]) && (fullExpression[char] != '(' &&  fullExpression[char] != ')') && (!isNumeric(fullExpression[char + 1]) && (fullExpression[char + 1] != '(' &&  fullExpression[char + 1] != ')')))
            fullExpression = fullExpression.slice(0, char) + fullExpression.slice(char + 1, fullExpression.length);
}

function multiplyNumberAfterParenthesis(): void {
    for (let char = 0; char < fullExpression.length; char++)
        if (fullExpression[char] == ')' && isNumeric(fullExpression[char + 1]))
            fullExpression = fullExpression.slice(0, char + 1) + '*' + fullExpression.slice(char + 1, fullExpression.length);
}

function updateHtml(): void {
    resultHtml!.textContent = fullExpression;
}
