import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AuctionResult } from '../types/auction';

export async function exportToPDF(results: AuctionResult) {
  const pdf = new jsPDF();
  
  pdf.setFontSize(20);
  pdf.text('Vickrey Auction Results', 20, 20);
  
  pdf.setFontSize(14);
  pdf.text(`Total Value: $${results.totalValue}`, 20, 40);
  
  pdf.text('Winners:', 20, 60);
  results.winners.forEach((winner, index) => {
    const y = 80 + (index * 20);
    pdf.text(`Bidder ${winner.bidderId}:`, 30, y);
    pdf.text(`Winning Bid: $${winner.winningBid}`, 40, y + 7);
    pdf.text(`Vickrey Price: $${winner.vickreyPrice}`, 40, y + 14);
  });
  
  const explanationY = 80 + (results.winners.length * 20) + 20;
  pdf.text('Explanation:', 20, explanationY);
  results.explanation.forEach((line, index) => {
    pdf.text(line, 30, explanationY + 20 + (index * 7));
  });
  
  pdf.save('vickrey-auction-results.pdf');
}

export async function shareResults(results: AuctionResult) {
  const text = `Vickrey Auction Results:\n
Total Value: $${results.totalValue}\n
Winners:\n${results.winners.map(w => 
  `Bidder ${w.bidderId}: Won with $${w.winningBid}, pays $${w.vickreyPrice}`
).join('\n')}`;

  try {
    if (navigator.canShare && navigator.canShare({ text })) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  } catch (error) {
    console.error('Sharing failed:', error);
    try {
      await navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    } catch (clipboardError) {
      console.error('Clipboard copy failed:', clipboardError);
      alert('Unable to share or copy results. Please try again.');
    }
  }
}