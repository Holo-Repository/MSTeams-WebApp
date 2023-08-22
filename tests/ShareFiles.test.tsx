import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ShareFiles from '../src/routes/views/fileSharing/ShareFiles';

describe('ShareFilesTests', () => {
    beforeEach(() => {
      
    });
  
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('ShareFiles renders correctly', () => {
        const fileType = 'image';
        const loadFile = jest.fn();
        render(<ShareFiles fileType={fileType} loadFile={loadFile} />);
        expect(screen.getByText('File URL')).toBeInstanceOf(HTMLLabelElement);
        expect(screen.getByPlaceholderText('Enter a file URL')).toBeInstanceOf(HTMLInputElement);
    });
  
});
  
export{};