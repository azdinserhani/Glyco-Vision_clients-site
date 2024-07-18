import React, { useState } from "react";
import Downshift from "downshift";

const items = [
  { value: "fever" },
  { value: "headache" },
  { value: "nausea" },
  // Add more options as needed
];

const AutocompleteSelect = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <Downshift
      onChange={(selection) => setSelectedItem(selection)}
      itemToString={(item) => (item ? item.value : "")}
      inputValue={inputValue}
      onInputValueChange={(value) => setInputValue(value)}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div style={{ width: "300px", margin: "0 auto", paddingTop: "20px" }}>
          <label
            {...getLabelProps()}
            style={{ display: "block", marginBottom: "8px" }}
          >
            Entrez le symptôme
          </label>
          <input
            {...getInputProps()}
            placeholder="Rechercher un symptôme"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #00bcd4",
              fontSize: "16px",
            }}
          />
          <ul
            {...getMenuProps()}
            style={{ listStyleType: "none", padding: 0, margin: 0 }}
          >
            {isOpen
              ? items
                  .filter(
                    (item) => !inputValue || item.value.includes(inputValue)
                  )
                  .map((item, index) => (
                    <li
                      {...getItemProps({
                        key: item.value,
                        index,
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? "#bde4ff" : "white",
                          fontWeight: selectedItem === item ? "bold" : "normal",
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        },
                      })}
                    >
                      {item.value}
                    </li>
                  ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default AutocompleteSelect;
