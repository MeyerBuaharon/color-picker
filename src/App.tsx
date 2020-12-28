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
`;

const ColorDiv = styled.div`
  height: 101px;
  width: 101px;
  background: linear-gradient(rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0.8)),
    radial-gradient(at 100% 50%, rgba(255, 0, 0, 1) 45%, rgba(0, 0, 0, 0.5) 90%);
  display: flex;
`;

const Pointer = styled.div`
  width: 18px;
  position: absolute;
  height: 18px;
  border-radius: 50%;
  transform: translate(-9px, -1px);
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
      setHsl({ hue: colors[0], saturation: colors[1], lightness: colors[2] });
    }
  };

  const onMouseDown = () => setIsDragging(true);

  const onMouseUp = () => setIsDragging(false);

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setHsl((prevColor) => ({
      hue: prevColor.hue,
      saturation: e.pageX > 100 ? 100 : e.pageX,
      lightness: e.pageY > 100 ? 100 : e.pageY,
    }));
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
        <Pointer hsl={hsl} />
      </ColorDiv>
      <PickedColor hsl={hsl} />
      <input
        disabled
        type="text"
        value={`hsl(${hsl.hue},${hsl.saturation}%,${100 - hsl.lightness}%)`}
        onChange={onChangeText}
      ></input>
    </Wrapper>
  );
};

export default App;
