export default function calcAll() {
  const maxMeshTopTemp = 75;
  const maxMeshBottomTemp = 73;
  const maxReservoirTemp = 71;

  if (frameCount % 60 === 0) {
    if (state.waterOnMesh) {
      state.apparatusTemperatureTop = state.apparatusTemperatureTop + (maxMeshTopTemp - state.apparatusTemperatureTop) * 0.1;
    } else {
      state.apparatusTemperatureTop = state.apparatusTemperatureTop + (state.airTemperature - state.apparatusTemperatureTop) * 0.1;
    }

    if (state.waterInReservoir) {
      state.apparatusTemperatureBottom = state.apparatusTemperatureBottom + (maxMeshBottomTemp - state.apparatusTemperatureBottom) * 0.1;
      state.reservoirTemperature = state.reservoirTemperature + (maxReservoirTemp - state.reservoirTemperature) * 0.1;
    } else {
      state.apparatusTemperatureBottom = state.apparatusTemperatureBottom + (state.airTemperature - state.apparatusTemperatureBottom) * 0.1;
      state.reservoirTemperature = state.reservoirTemperature + (state.airTemperature - state.reservoirTemperature) * 0.1;
    }
  }
}