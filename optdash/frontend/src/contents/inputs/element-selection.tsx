import React from 'react';

function ElementSelection(props: { candidates: string[], display_name: string, setter: (x: string) => void }) {
  let display_name: string = props.display_name;
  let selector_id: string = display_name + "-choice";
  return (
    <div>
      <label htmlFor={selector_id}>{display_name}: </label>
      <input list={display_name} id={selector_id} name={selector_id} />
      <datalist id={display_name}>
        {props.candidates.map((x) => <option value={x} />)}
      </datalist>
      <button onClick={() => {
        let name_choices = document.getElementById(selector_id) as HTMLInputElement;
        if (name_choices !== null) {
          props.setter(name_choices.value);
        }
      }}>Use</button>
    </div>
  );
}

export default ElementSelection;