import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";

interface IHsl {
  hue: number;
  saturation: number;
  lightness: number;
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
`;

const ColorDiv = styled.div`
  height: 101px;
  width: 101px;
  background: rgba(255, 0, 0, 1);
  position: relative;
  display: flex;
  border: 1px solid black;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
`;
const Overlay2 = styled(Overlay)`
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 20%,
    rgba(0, 0, 0, 0) 20%,
    rgba(0, 0, 0, 1) 100%
  );
`;

const Pointer = styled.div`
  width: 18px;
  position: absolute;
  height: 18px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
  background-color: rgb(248, 248, 248);
  z-index: 99;
  left: ${({ hsl }: { hsl: IHsl }) => hsl.saturation}px;
  top: ${({ hsl }: { hsl: IHsl }) => hsl.lightness}px;
`;

const PickedColor = styled.div`
  height: 20px;
  width: 101px;
  margin: 5px 0;
  background-color: ${({ hsl }: { hsl: IHsl }) =>
    `hsl(${hsl.hue},${hsl.saturation}%,${100 - hsl.lightness}%)`};
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const [hsl, setHsl] = useState<IHsl>({
    hue: 0,
    lightness: 50,
    saturation: 50,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState(
    `hsl(${hsl.hue},${hsl.saturation}%,${100 - hsl.lightness}%)`
  );

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.startsWith("hsl(") && value.endsWith(")")) {
      const colors = value
        .substring(4)
        .replace(")", "")
        .replaceAll("%", "")
        .split(",")
        .map((color) => parseInt(color));
      if (colors.every((color) => color <= 100 && color >= 0)) {
        setHsl({ hue: colors[0], saturation: colors[1], lightness: colors[2] });
      }
    }
    setText(value);
  };

  const onMouseDown = () => setIsDragging(true);

  const onMouseUp = () => setIsDragging(false);

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setHsl((prevColor) => {
      const newHsl = {
        hue: prevColor.hue,
        saturation: e.clientX > 100 ? 100 : e.clientX,
        lightness: e.clientY > 100 ? 100 : e.clientY,
      };
      setText(
        `hsl(${newHsl.hue},${newHsl.saturation}%,${100 - newHsl.lightness}%)`
      );

      return newHsl;
    });
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      onClick(e);
    }
  };

  return (
    <Wrapper>
      <ColorDiv
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onClick={onClick}
      >
        <Overlay>
          <Overlay2 />
        </Overlay>
        <Pointer draggable={false} hsl={hsl} />
      </ColorDiv>
      <PickedColor hsl={hsl} />
      <input type="text" value={text} onChange={onChangeText} disabled></input>
    </Wrapper>
  );
};

export default App;
