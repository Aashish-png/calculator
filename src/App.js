import "./App.css";
import DigitsButtons from "./DigitsButtons";
import OperationButton from "./OperationButton";
import { useReducer } from "react";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "elvaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand == "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")){
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,//SENDING PARAMETERS IN DESPATCH FUNCTIONS WHENEVER CLICK ANY BUTTON 
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {  // IF THE CURRENT AND PREVIOUS OPERAND IS EMPTY DO NOTHING
        return state;
      }
      if (state.previousOperand == null) { // IF THERE IS ANYTHING IN CURRENT OPERAND 
        return {
          ...state,
          operation: payload.operation,      //THEN SEND PAYLOAD.OPERATION(+,/,*,-) TO OPERATION BUTTON COMPONENT IN DISPATCH FUNCTION
          previousOperand: state.currentOperand,// AND SEND CURRENT OPERAND TO PREVIOUS OPERAND 
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1),
      }
    case ACTIONS.CLEAR:
      return {};
  }
}
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)}
          {operation}
        </div>
        <div className="currnet-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        Del
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitsButtons digit="1" dispatch={dispatch} />
      <DigitsButtons digit="2" dispatch={dispatch} />
      <DigitsButtons digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitsButtons digit="4" dispatch={dispatch} />
      <DigitsButtons digit="5" dispatch={dispatch} />
      <DigitsButtons digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitsButtons digit="7" dispatch={dispatch} />
      <DigitsButtons digit="8" dispatch={dispatch} />
      <DigitsButtons digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitsButtons digit="." dispatch={dispatch} />
      <DigitsButtons digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
