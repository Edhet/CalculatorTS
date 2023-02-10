const resultHtml = document.getElementById("result");


let fullExpression: string = "0";

function clearDisplayButton(): void {
    fullExpression = "0";
    updateHtml();
}

function readInputButton(valueInput: string): void {
    console.log("pressed: "+valueInput)

    if (valueInput == ')' && !fullExpression.includes('('))
        return;
    if (valueInput == '(' && isNumeric(fullExpression[fullExpression.length - 1]))
        fullExpression += '*';


    if (fullExpression == "0" || fullExpression == "Error")
        fullExpression = valueInput;
    else
        fullExpression += valueInput;
    multiplyNumberAfterParenthesis();

    updateHtml();
    console.log("inserted Expre: "+fullExpression);

}

function readOperationButton(operationInput: string): void {
    console.log("pressed: "+operationInput)

    if (!isNumeric(fullExpression[fullExpression.length - 1]))
        return;

    fullExpression += operationInput;
    updateHtml();
    console.log("inserted Expre: "+fullExpression);

}

function calculateResult() {
    removeUselessOperations();
    while (howManyParenthesisOpen() > 0)
        fullExpression += ')';
    fullExpression = evaluateExpression(fullExpression);
    console.log("final Expre: "+fullExpression);
    updateHtml();
}

function evaluateExpression(expression: string): string {

    console.log("expression to calc: " + expression);
    if (!expression.includes('+') && !expression.includes('-') && !expression.includes('*') && !expression.includes('/') && !expression.includes('(') && !expression.includes(')'))
        return expression;

    while (expression.includes('(') && expression.includes(')')) {
        let startIndex = 0, endIndex = 0;
        console.log("expression to calc: " + expression);

        for (let index = 0; index < expression.length; index++) {
            if (expression[index] == '(')
                startIndex = index;
            if (expression[index] == ')')
                endIndex = index;
            if (endIndex != 0 && endIndex > startIndex)
                break;
        }

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
                        finalIndexTwo = forwardChar;
                        secondNumber = expression.slice(firstIndexTwo, finalIndexTwo);
                        let result: number = Number(firstNumber) * Number(secondNumber);
                        expression = expression.slice(0, firstIndexOne) + result.toString() + expression.slice(finalIndexTwo + 1, expression.length);
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
                        finalIndexTwo = forwardChar;
                        secondNumber = expression.slice(firstIndexTwo, finalIndexTwo);
                        if (Number(secondNumber) == 0)
                            return "Error";
                        let result: number = Number(firstNumber) / Number(secondNumber);
                        expression = expression.slice(0, firstIndexOne) + result.toString() + expression.slice(finalIndexTwo + 1, expression.length);
                        break;
                    }
                }
                break;
            }
        }
    }

    while (expression.includes('+') || expression.includes('-')) {
        let firstNumber = "", secondNumber = "";
        for (let char = 0; char < expression.length; char++) {
            if (expression[char] == '+') {
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

            else if (expression[char] == '-') {
                for (let forwardChar = char + 1; forwardChar < expression.length; forwardChar++) {
                    if (isNumeric(expression[forwardChar]))
                        secondNumber += expression[forwardChar];

                    if (!isNumeric(expression[forwardChar]) || forwardChar == expression.length - 1) {
                        let result: number = Number(firstNumber) + (Number(secondNumber) * -1);
                        expression = (forwardChar != expression.length - 1) ? result.toString() + expression.slice(forwardChar, expression.length) : result.toString();
                        break;
                    }
                }
                break;
            }

            firstNumber += expression[char];
        }
    }

    console.log("result "+expression);
    return expression;
}

function removeUselessOperations() {
    for (let char = 0; char < fullExpression.length; char++)
        if (!isNumeric(fullExpression[char]) && (fullExpression[char] != '(' &&  fullExpression[char] != ')') && (!isNumeric(fullExpression[char + 1]) && (fullExpression[char + 1] != '(' &&  fullExpression[char + 1] != ')')))
                fullExpression = fullExpression.slice(0, char) + fullExpression.slice(char + 1, fullExpression.length);
}

function multiplyNumberAfterParenthesis() {
    for (let char = 0; char < fullExpression.length; char++)
        if (fullExpression[char] == ')' && isNumeric(fullExpression[char + 1]))
            fullExpression = fullExpression.slice(0, char + 1) + '*' + fullExpression.slice(char + 1, fullExpression.length);
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

function isNumeric(char: string){
    return !isNaN(Number(char));
}

function updateHtml(): void {
    resultHtml!.textContent = fullExpression;
}
