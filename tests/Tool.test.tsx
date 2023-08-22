import { render, screen } from '@testing-library/react';
import Tool from "../src/routes/views/canvas/toolbar/tools/Tool";
import React from 'react';
import { InkingTool } from '@microsoft/live-share-canvas';


describe('Tool Component', () => {

    const mockSelectTool = jest.fn();
    const mockIsSelected = jest.fn();
    const mockIsDoubleClicked = jest.fn();
    const mockExt = jest.fn();

    beforeEach(() => {
        mockSelectTool.mockClear();
        mockIsSelected.mockClear();
        mockIsDoubleClicked.mockClear();
        mockExt.mockClear();
    });

    it('renders correctly', () => {
        render(
            <Tool 
                icon = "✒️"
                tool = {InkingTool.pen}
                isDoubleClicked={mockIsDoubleClicked}
                isSelected={mockIsSelected}
                selectTool={mockSelectTool}
                ext={mockExt}
            />
        );
       expect(screen.getByText("✏️")).toBeInTheDocument();
    });
});

export{};

