import { FloaterKeys } from "../floaters/IFloater";


/**
 * Accepted file types for file sharing.
 */
export type AcceptedFileTypes = 'image' | 'pdf';

/**
 * Keys of the SharedMap for a file.
 */
export const FileKeys = {
    ...FloaterKeys,
    url: "url",
    fileType: "fileType",
} as const;

/**
 * Keys of the SharedMap for a PDF.
 */
export const PDFKeys = {
    ...FileKeys,
    currentPage: "currentPage",
    pageScroll: "pageScroll",
} as const;