import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { ReportProps } from '@/components/ReportTemplate';

const A4_W = 595.28;
const A4_H = 841.89;

export async function generateNameReport(reportProps: ReportProps): Promise<void> {
  try {
    console.log('generatePDF: waiting for fonts');
    await document.fonts.ready;
    console.log('generatePDF: fonts ready');

    const slide1 = document.getElementById('report-slide-1');
    const slide2 = document.getElementById('report-slide-2');

    console.log('generatePDF: slide1 found:', !!slide1);
    console.log('generatePDF: slide2 found:', !!slide2);

    if (!slide1 || !slide2) {
      throw new Error('Report template elements not found in DOM');
    }

    // Inject overrides into the real document so getComputedStyle
    // never returns oklch values during html2canvas capture
    const overrideStyle = document.createElement('style');
    overrideStyle.id = 'html2canvas-oklch-fix';
    overrideStyle.textContent = `
      #report-slide-1 *, #report-slide-2 * {
        --tw-ring-shadow: none !important;
        --tw-shadow: none !important;
        --tw-ring-color: rgba(59,130,246,0.5) !important;
        --tw-shadow-color: rgba(0,0,0,0.1) !important;
        box-shadow: none !important;
        outline: none !important;
        border-color: transparent !important;
        text-decoration-color: currentColor !important;
        font-family: Arial, Helvetica, sans-serif !important;
        word-spacing: normal !important;
        letter-spacing: normal !important;
        -webkit-font-smoothing: auto !important;
      }
    `;
    document.head.appendChild(overrideStyle);

    // Allow the override styles to apply before capture
    await new Promise(resolve => setTimeout(resolve, 100));

    const ignoreElements = (element: Element) =>
      element.tagName === 'SCRIPT' ||
      element.tagName === 'LINK' ||
      element.id === 'html2canvas-oklch-fix';

    console.log('generatePDF: capturing slide 1');
    const canvas1 = await html2canvas(slide1, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0D0A14',
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      logging: false,
      ignoreElements,
    });
    console.log('generatePDF: slide 1 captured', canvas1.width, canvas1.height);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    pdf.addImage(canvas1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, A4_W, A4_H);

    pdf.addPage();

    console.log('generatePDF: capturing slide 2');
    const canvas2 = await html2canvas(slide2, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#1A1424',
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      logging: false,
      ignoreElements,
    });
    console.log('generatePDF: slide 2 captured', canvas2.width, canvas2.height);

    pdf.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, A4_W, A4_H);

    // Clean up the override style
    document.head.removeChild(overrideStyle);

    console.log('generatePDF: saving PDF');
    pdf.save(`${reportProps.name}_HeyBaby_Report.pdf`);
    console.log('generatePDF: done');

  } catch (err) {
    // Clean up override style even on failure
    document.getElementById('html2canvas-oklch-fix')?.remove();
    console.error('generatePDF error:', err);
    throw err;
  }
}
