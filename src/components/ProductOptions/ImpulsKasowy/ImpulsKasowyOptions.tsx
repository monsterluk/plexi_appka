import React from 'react';
import { ImpulsKasowy } from './ImpulsKasowy';

interface ImpulsKasowyOptionsProps {
  onOptionsChange: (options: any) => void;
  initialOptions?: any;
}

export const ImpulsKasowyOptions: React.FC<ImpulsKasowyOptionsProps> = ({
  onOptionsChange,
  initialOptions
}) => {
  return <ImpulsKasowy />;
};