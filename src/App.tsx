import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

interface IHsl {
  hue: number;
  saturation: number;
  lightness: number;
}

const ColorDiv = styled.div`
  height: 101px;
  width: 101px;
  background-color: ${({ hsl }: { hsl: IHsl }) =>
    `hsl(${hsl.hue},${hsl.saturation}%,${hsl.lightness}%)`};
  display: flex;
  flex-direction: column-reverse;
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
        hsl={hsl}
      >
        <Pointer hsl={hsl} />
      </ColorDiv>

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
