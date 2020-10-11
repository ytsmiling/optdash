import React, { useState, useEffect } from 'react';

function ElementSelection(props: { candidates: string[], display_name: string, setter: (x: string) => void, default_value: string }) {
  let display_name: string = props.display_name;
  let selector_id: string = display_name + "-choice";
  const [default_value, setDefaultValue] = useState("");
  useEffect(
    () => {
      setDefaultValue(props.default_value);
    },
    [props.default_value]
  )

  return (
    <div>
      <label htmlFor={selector_id}>{display_name}: </label>
      <input list={display_name} id={selector_id} name={selector_id} value={default_value} onChange={(e) => { setDefaultValue(e.target.value); }} />
      <datalist id={display_name}>
        {props.candidates.map((x) => <option value={x} />)}
      </datalist>
      <button onClick={() => {
        let name_choices = document.getElementById(selector_id) as HTMLInputElement;
        if (name_choices !== null) {
          if (props.candidates.includes(name_choices.value)) {
            props.setter(name_choices.value);
          }
        }
      }}>Use</button>
    </div>
  );
}

export default ElementSelection;