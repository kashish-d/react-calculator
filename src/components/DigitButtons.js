import { ACTIONS } from '../App';

function DigitButton({ className, digit, dispatch }) {
    return (
        <button
            className={className || ' '}
            onClick={() =>
                dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })
            }
        >
            {digit}
        </button>
    );
}

export default DigitButton;
