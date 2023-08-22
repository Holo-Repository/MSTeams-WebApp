import React from 'react';
import { render } from '@testing-library/react';
import { InkingManager } from "@microsoft/live-share-canvas";
import { appToScreenPos, FloaterAppCoords } from "../src/routes/views/utils/FloaterUtils";


describe('FloaterUtils', () => {
  beforeEach(() => {
    
  });

  afterEach(() => {

  });

  test ('appToScreenPos is a function', () => {
    expect(appToScreenPos).toBeDefined();
    expect(appToScreenPos).toBeInstanceOf(Function);
  });

});



export{};




