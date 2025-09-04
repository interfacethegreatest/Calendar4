import * as React from 'react';
import { motion } from 'framer-motion';
import { Poppins } from 'next/font/google';
import { useRef, useState } from 'react';
import style from "./ModalInput.module.css"
import outsideClick from './outsideClick';
import { AiOutlinePlus } from 'react-icons/ai';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITagInputProps {
  prevSlide: Function;
  name: string;
  label: string;
  type: string;
  icon: React.ReactNode;
  placeholder: string;
  tags: string[];
  setTags: Function;
  error: any;
  disabled: boolean;
  autoComplete?: boolean; 
  height: number | null;
  topLocation: number | null;
  inputLength: number;
}

const TagInput: React.FunctionComponent<ITagInputProps> = (props) => {
  const { 
    name, label, type, icon, placeholder, tags, setTags, 
    error, disabled, height, topLocation, inputLength, prevSlide 
  } = props;

  const [clicked, setClicked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [text, setText] = useState("");
  const [textCount, setTextCount] = useState(0);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    setTextCount(event.target.value.length);
  };

  const handleClickedContent = () => {
    setClicked(true);
  };

  const unclickContent = () => {
    if (text.trim() === "" && tags.length === 0) {
      setClicked(false);
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  outsideClick(ref, () => unclickContent());

  // Add tag
  const addTag = () => {
    if (text.trim() !== "") {
      setTags([...tags, text.trim()]);
      setText("");
      setTextCount(0);
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Handle Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && text.trim() !== "") {
      event.preventDefault(); // prevent newline
      addTag();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {/* Input + button row */}
      <div style={{ display: "flex" }}>
        <div
          onClick={handleClickedContent}
          id={clicked ? (error ? style.glowingInputContainerError : style.glowingInputContainer) : style.inputContainer}
          ref={ref}
          style={{
            height: height ? `${height}px` : undefined,
            flex: 1,
          }}
        >
          <motion.span
            initial={{ x: 0, y: "50%", fontSize: "1.1rem", color: "rgb(22, 60, 47)" }}
            animate={
              prevSlide || clicked || tags.length > 0
                ? error
                  ? { x: 0, y: "-20%", fontSize: "0.65rem", color: "rgb(200, 60, 60)" }
                  : { x: 0, y: "-20%", fontSize: "0.65rem", color: "rgb(42, 111, 87)" }
                : { x: 0, y: "0%", fontSize: "1.1rem", color: "rgb(106, 106, 106)" }
            }
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              left: "10px",
              transformOrigin: "left center",
            }}
            id={style.inputLabel}
          >
            {error ? error : label}
          </motion.span>
          <textarea
            id={style.inputStyle}
            autoComplete="off"
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}   
            style={{ top: topLocation! }}
            disabled={isDisabled}
            onFocus={handleClickedContent}
          />
          <h6 id={error ? style.textCountError : style.textCount}>
            {textCount} / {inputLength}
          </h6>
        </div>

        {/* Add button */}
        <div
          id={style.sendTagButton}
          onClick={addTag}
        >
          <AiOutlinePlus size={28} />
        </div>
      </div>

      {/* Tag list */}
      <div id={style.tagList}>
        {tags.map((tag, index) => (
          <div key={index} className={style.tagChip}>
            {tag}
            <button
              type="button"
              className={style.tagRemoveBtn}
              onClick={() => removeTag(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
