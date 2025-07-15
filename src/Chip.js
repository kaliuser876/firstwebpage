import React from 'react';
import chipMap from './chipMap.png';

const CHIP_WIDTH = 32;
const CHIP_HEIGHT = 44;
const TILEMAP_WIDTH = 128;
const TILEMAP_HEIGHT = 379;
//const NUM_COLS = 4;
const NUM_ROWS = 8;

// Compute vertical spacing between rows
const totalVerticalSpacing = TILEMAP_HEIGHT - (CHIP_HEIGHT * NUM_ROWS); // 27px
const rowSpacing = totalVerticalSpacing / (NUM_ROWS - 1); // ≈ 3.857px
const STEP_Y = CHIP_HEIGHT + rowSpacing;

const Chip = ({ set = 0, index = 0 }) => {
  const xOffset = index * CHIP_WIDTH;
  const yOffset = set * STEP_Y;

  const scale = 3; // Or 3, or 1.5, or pass this in via props

const style = {
  width: `${CHIP_WIDTH}px`,
  height: `${CHIP_HEIGHT}px`,
  backgroundImage: `url(${chipMap})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: `${TILEMAP_WIDTH}px ${TILEMAP_HEIGHT}px`,
  backgroundPosition: `-${xOffset}px -${yOffset}px`,
  imageRendering: 'pixelated',
  display: 'inline-block',
  overflow: 'hidden',
  transform: `scale(${scale})`,
  transformOrigin: 'top left',
};

  return <div style={style} />;
};

export default Chip;
