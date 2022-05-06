/* eslint-disable default-case */
import { useReducer } from 'react';
import './styles.css';

// components
import DigitButton from './components/DigitButtons';
import OperationButton from './components/OperationButton';

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CLEAR: 'clear',
    CHOOSE_OPERATION: 'choose-operation',
    EQUALS: 'equals',
    DELETE_DIGIT: 'delete-digit',
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
            if (payload.digit === '.' && state.currentOperand == null) {
                return {
                    ...state,
                    currentOperand: '0.',
                };
            }
            //To avoid putting more than one 0 in the start
            if (payload.digit === '0' && state.currentOperand === '0') {
                return state;
            }
            //To avoid having multiple decimal points in a single number
            if (payload.digit === '.' && state.currentOperand.includes('.')) {
                return state;
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`, //payload.digit will be passed as paramter while invoking dispatch
            };
        case ACTIONS.CLEAR:
            return {};
        case ACTIONS.CHOOSE_OPERATION:
            // To avoid having any operation without operands
            if (state.currentOperand == null && state.previousOperand == null) {
                return state;
            }

            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                };
            }

            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null,
                };
            }
            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null,
            };
        case ACTIONS.EQUALS:
            if (
                state.operation == null ||
                state.currentOperand == null ||
                state.previousOperand == null
            ) {
                return state;
            }
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
            };
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: null,
                    overwrite: false,
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
                currentOperand: state.currentOperand.slice(0, -1),
            };
        default:
            return state;
    }
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
});

function formatOperand(operand) {
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    if (decimal == null) {
        return INTEGER_FORMATTER.format(integer);
    }
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(current) || isNaN(prev)) {
        return '';
    }
    let result = '';
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            result = prev / current;
            break;
    }
    return result.toString();
}

function App() {
    const [{ currentOperand, previousOperand, operation }, dispatch] =
        useReducer(reducer, {});

    return (
        <div className='calc-container'>
            <div className='output'>
                <div className='previousOperand'>
                    {formatOperand(previousOperand)} {operation}
                </div>
                <div className='currentOperand'>
                    {formatOperand(currentOperand)}
                </div>
            </div>
            <div className='calc-buttons'>
                <button
                    className='grey'
                    onClick={() => dispatch({ type: ACTIONS.CLEAR })}
                >
                    C
                </button>
                <button
                    className='grey'
                    onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
                >
                    DEL
                </button>
                <button className='grey'>%</button>
                <OperationButton
                    operation='÷'
                    className='purple'
                    dispatch={dispatch}
                />
                <DigitButton digit='7' dispatch={dispatch} />
                <DigitButton digit='8' dispatch={dispatch} />
                <DigitButton digit='9' dispatch={dispatch} />
                <OperationButton
                    operation='×'
                    className='purple'
                    dispatch={dispatch}
                />
                <DigitButton digit='4' dispatch={dispatch} />
                <DigitButton digit='5' dispatch={dispatch} />
                <DigitButton digit='6' dispatch={dispatch} />
                <OperationButton
                    operation='-'
                    className='purple'
                    dispatch={dispatch}
                />
                <DigitButton digit='1' dispatch={dispatch} />
                <DigitButton digit='2' dispatch={dispatch} />
                <DigitButton digit='3' dispatch={dispatch} />
                <OperationButton
                    operation='+'
                    className='purple'
                    dispatch={dispatch}
                />
                <DigitButton
                    digit='0'
                    className='span-two'
                    dispatch={dispatch}
                />
                <DigitButton digit='.' dispatch={dispatch} />
                <button onClick={() => dispatch({ type: ACTIONS.EQUALS })}>
                    {' '}
                    ={' '}
                </button>
            </div>
        </div>
    );
}

export default App;
