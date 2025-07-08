import React, { useState, useEffect } from "react";
import "./ScoutTranslator.css";

// --- Lógica de las Claves ---

const ciphers = {
  murcielago: {
    name: "Murciélago",
    encodeMap: {
      m: "0",
      u: "1",
      r: "2",
      c: "3",
      i: "4",
      e: "5",
      l: "6",
      a: "7",
      g: "8",
      o: "9",
    },
    decodeMap: {
      0: "m",
      1: "u",
      2: "r",
      3: "c",
      4: "i",
      5: "e",
      6: "l",
      7: "a",
      8: "g",
      9: "o",
    },
  },
  eucalipto: {
    name: "Eucalipto",
    encodeMap: {
      e: "0",
      u: "1",
      c: "2",
      a: "3",
      l: "4",
      i: "5",
      p: "6",
      t: "7",
      o: "8",
      s: "9",
    },
    decodeMap: {
      0: "e",
      1: "u",
      2: "c",
      3: "a",
      4: "l",
      5: "i",
      6: "p",
      7: "t",
      8: "o",
      9: "s",
    },
  },
  morse: {
    name: "Morse",
    encodeMap: {
      a: ".-",
      b: "-...",
      c: "-.-.",
      d: "-..",
      e: ".",
      f: "..-.",
      g: "--.",
      h: "....",
      i: "..",
      j: ".---",
      k: "-.-",
      l: ".-..",
      m: "--",
      n: "-.",
      o: "---",
      p: ".--.",
      q: "--.-",
      r: ".-.",
      s: "...",
      t: "-",
      u: "..-",
      v: "...-",
      w: ".--",
      x: "-..-",
      y: "-.--",
      z: "--..",
      1: ".----",
      2: "..---",
      3: "...--",
      4: "....-",
      5: ".....",
      6: "-....",
      7: "--...",
      8: "---..",
      9: "----.",
      0: "-----",
      " ": "/",
    },
    decodeMap: {}, // Se genera dinámicamente
  },
};

// Generar el mapa de decodificación de Morse
for (const key in ciphers.morse.encodeMap) {
  ciphers.morse.decodeMap[ciphers.morse.encodeMap[key]] = key;
}

const translate = (text, cipherKey, direction) => {
  const cipher = ciphers[cipherKey];
  if (!cipher) return "Clave no encontrada";

  const lowerText = text.toLowerCase();

  if (cipherKey === "morse") {
    if (direction === "encode") {
      return lowerText
        .split("")
        .map((char) => cipher.encodeMap[char] || "")
        .join(" ");
    } else {
      return text
        .split(" ")
        .map((code) => cipher.decodeMap[code] || "")
        .join("");
    }
  } else {
    const map = direction === "encode" ? cipher.encodeMap : cipher.decodeMap;
    return lowerText
      .split("")
      .map((char) => map[char] || char)
      .join("");
  }
};

const ScoutTranslator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCipher, setSelectedCipher] = useState("murcielago");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [direction, setDirection] = useState("encode"); // 'encode' o 'decode'

  useEffect(() => {
    if (inputText === "") {
      setOutputText("");
      return;
    }
    const result = translate(inputText, selectedCipher, direction);
    setOutputText(result);
  }, [inputText, selectedCipher, direction]);

  const handleSwap = () => {
    setDirection((prev) => (prev === "encode" ? "decode" : "encode"));
    setInputText(outputText);
  };

  if (!isOpen) {
    return (
      <button
        className="translator-toggle-button"
        onClick={() => setIsOpen(true)}
      >
        Traductor Scout
      </button>
    );
  }

  return (
    <div className="translator-container">
      <div className="translator-header">
        <h3>Traductor de Claves Scout</h3>
        <button
          className="translator-close-button"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
      </div>
      <div className="translator-controls">
        <select
          value={selectedCipher}
          onChange={(e) => setSelectedCipher(e.target.value)}
        >
          {Object.keys(ciphers).map((key) => (
            <option key={key} value={key}>
              {" "}
              {ciphers[key].name}{" "}
            </option>
          ))}
        </select>
      </div>
      <div className="translator-io">
        <div className="translator-area">
          <label>
            {direction === "encode" ? "Texto Original" : "Texto Cifrado"}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe aquí..."
          />
        </div>
        <button className="swap-button" onClick={handleSwap}>
          {" "}
          &#8646;{" "}
        </button>
        <div className="translator-area">
          <label>
            {direction === "encode" ? "Texto Cifrado" : "Texto Original"}
          </label>
          <textarea value={outputText} readOnly placeholder="Traducción..." />
        </div>
      </div>
    </div>
  );
};

export default ScoutTranslator;
