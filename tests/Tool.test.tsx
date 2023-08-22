import { render, fireEvent } from '@testing-library/react';
import Tool from "../src/routes/views/canvas/toolbar/tools/Tool";
import React from 'react';
import { InkingTool } from '@microsoft/live-share-canvas';

jest.mock("@microsoft/live-share-canvas", () => ({
    InkingTool: {
        pen: 0,
        laserPointer: 1,
        highlighter: 2,
        eraser: 3,
        pointEraser: 4,
        line: 5
    },
}))


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
        mockIsSelected.mockReturnValue(true);

        const { getByRole } = render(
            <Tool 
                icon = "✒️"
                tool = {InkingTool.pen}
                isDoubleClicked={mockIsDoubleClicked}
                isSelected={mockIsSelected}
                selectTool={mockSelectTool}
                ext={mockExt}
            />
        );
        const button = getByRole("button");
        expect(button).toBeInTheDocument();
        expect(mockIsSelected).toHaveBeenCalledWith(InkingTool.pen);
    });

    it('calls selectTool when button is clicked', () => {

        const { getByRole } = render(
            <Tool 
                icon = "✒️"
                tool = {InkingTool.pen}
                isDoubleClicked={mockIsDoubleClicked}
                isSelected={mockIsSelected}
                selectTool={mockSelectTool}
                ext={mockExt}
            />
        );
        const button = getByRole("button");
        fireEvent.click(button);
        expect(mockSelectTool).toHaveBeenCalled();
    });
});
