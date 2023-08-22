import { render, fireEvent} from '@testing-library/react';
import SizeSelector from "../src/routes/views/canvas/toolbar/tools/SizeSelector";
import React from 'react';


describe("SizeSelector Component", () => {
    it("renders correctly", () => {
        const setSizeMock = jest.fn();

        const { getByRole } = render(
            <SizeSelector defaultSize={10} setSize={setSizeMock} />
        );

        const slider = getByRole("slider");
        expect(slider).toBeInTheDocument();
        expect(slider).toHaveAttribute("aria-valuenow", "10");
    });

    it("calls setSize when slider is changed", () => {
        const setSizeMock = jest.fn();
        
        const { getByRole } = render(
            <SizeSelector defaultSize={10} setSize={setSizeMock} />
        );
        const slider = getByRole("slider");

        // mock drag event
        fireEvent.mouseDown(slider);
        fireEvent.mouseMove(slider, {clientX: 130});
        fireEvent.mouseUp(slider);

        expect(setSizeMock).toHaveBeenCalled();
    });
});