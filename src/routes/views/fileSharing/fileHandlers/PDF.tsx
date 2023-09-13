import { useEffect, useRef, useState } from 'react';
import { IValueChanged, SharedMap } from 'fluid-framework';
import { Button, Text, Toolbar } from '@fluentui/react-components';
import { throttle } from 'lodash';
import { Document, pdfjs, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { 
    ArrowForward24Filled as Arrow,
} from "@fluentui/react-icons";

import { PDFKeys } from '../IFile';
import { FloaterScreenSize } from "../../utils/FloaterUtils";
import styles from "../../../../styles/PDF.module.css";


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const throttleTime = 100;
/**
 * Update the remote scroll state.
 * The function is throttled since the DOM fires way too many scroll events.
 * @param dataMap - The remote data map.
 * @param scrollPercent - The scroll percentage.
 */
const setScroll = throttle((dataMap, scrollPercent: number) => {
    if (dataMap) dataMap.set(PDFKeys.pageScroll, scrollPercent);
}, throttleTime, { leading: true, trailing: true });


/**
 * Display a PDF file viewer
 */ 
function PDF(props: { url: string, screenSize: FloaterScreenSize, objMap: SharedMap }) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scrollPercent, setScrollPercent] = useState<number>(0);
    
    const bodyRef = useRef<HTMLDivElement>(null);

    const nextPage = () => { if (pageNumber < numPages!) props.objMap.set(PDFKeys.currentPage, pageNumber + 1) }
    const prevPage = () => { if (pageNumber > 1) props.objMap.set(PDFKeys.currentPage, pageNumber - 1) }

    /**
     * Register the event handler to receive remote PDF state updates.
     */
    useEffect(() => {
        const handler = (changed: IValueChanged) => {
            if (changed.key === PDFKeys.currentPage) { setPageNumber(props.objMap.get(PDFKeys.currentPage)!) }
            if (changed.key === PDFKeys.pageScroll) { setScrollPercent(props.objMap.get(PDFKeys.pageScroll)!) }
        }
        props.objMap.on('valueChanged', handler);
        return () => { props.objMap.off('valueChanged', handler) }
    }, [props.objMap]);

    /**
     * Handle scroll events from the PDF viewer.
     * Updates local scroll state and sends it to the remote PDF state.
     * @param e - The scroll event.
     */
    const handleScroll = (e: any) => {
        if (e.deltaY < 1) return;
        try {
            let scrollPercent = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
            scrollPercent = Math.min(1, Math.max(0, scrollPercent));
            setScrollPercent(scrollPercent);
            setScroll(props.objMap, scrollPercent);
        } catch (e: any) { raiseGlobalError(e) };
    }

    /**
     * Scroll the PDF viewer to the correct position when the scroll state changes.
     */
    useEffect(() => {
        if (!bodyRef.current) return;
        bodyRef.current.scrollTop = scrollPercent * (bodyRef.current.scrollHeight - bodyRef.current.clientHeight);
    }, [scrollPercent]);


    return <div className={styles.body} style={{ width: props.screenSize.width }} onScroll={handleScroll} ref={bodyRef} >
        <Toolbar className={styles.controls}>
            <Button onClick={prevPage} disabled={pageNumber === 1}><Arrow rotate={180}/></Button>
            <Text>{pageNumber}/{numPages}</Text>
            <Button onClick={nextPage} disabled={pageNumber === numPages}><Arrow /></Button>
        </Toolbar>
        <Document 
            file={props.url} 
            onLoadSuccess={({ numPages }) => {setNumPages(numPages)}} 
            onLoadError={raiseGlobalError}
            onSourceError={raiseGlobalError}
        >
            <Page 
                pageNumber={pageNumber} 
                width={props.screenSize.width} 
                height={props.screenSize.height} 
                onLoadError={raiseGlobalError}
                // onRenderError={raiseGlobalError}
                // onRenderTextLayerError={raiseGlobalError}
                onGetAnnotationsError={raiseGlobalError}
                onGetStructTreeError={raiseGlobalError}
                onGetTextError={raiseGlobalError}
            />
        </Document>
    </div>;
}

export default PDF;