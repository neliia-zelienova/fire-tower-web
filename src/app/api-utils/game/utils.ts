import { TowerPosition } from '@/types/towers';

export const chooseRandomTower = (exclude: TowerPosition[]) => {
  const positions = Object.values(TowerPosition).filter(
    (pos) => !exclude.includes(pos),
  );
  const randomIndex = Math.floor(Math.random() * positions.length);
  return positions[randomIndex];
};
