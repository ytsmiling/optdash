import React from 'react';

function MultiElementSelection(
    props: { candidates: string[], display_name: string, current_values: string[], setter: (x: string[]) => void }
) {
    let display_name: string = props.display_name;
    let selector_id: string = display_name + "-choice";
    return (
        <div>
            <div>
                {
                    props.current_values.map(
                        (x, idx) => <div>
                            <label htmlFor={selector_id + idx.toString()}>{display_name}: </label>

                            <input
                                list={display_name + idx.toString()}
                                id={selector_id + idx.toString()}
                                name={selector_id + idx.toString()} />

                            <datalist id={display_name + idx.toString()}>
                                {props.candidates.map((x) => <option value={x} />)}
                            </datalist>

                            <button onClick={() => {
                                let new_candidates = [...props.current_values];
                                let input_element = document.getElementById(
                                    selector_id + idx.toString()
                                ) as HTMLInputElement;
                                new_candidates[idx] = input_element.value;
                                props.setter(new_candidates);
                            }}>Use</button>
                        </div>
                    )
                }
            </div>
            <div>
                <button onClick={() => {
                    let new_candidates = [...props.current_values];
                    new_candidates.push("");
                    props.setter(new_candidates);
                }}>Add {display_name}.</button>
                <button onClick={() => {
                    let new_candidates = [...props.current_values];
                    new_candidates.pop();
                    props.setter(new_candidates);
                }}>Delete {display_name}.
        </button>
            </div>

        </div>
    );
}

export default MultiElementSelection;