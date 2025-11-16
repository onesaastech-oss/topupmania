'use client';

import { useState } from 'react';
import { FaSpinner, FaFileInvoice } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { getOrderStatus } from '../lib/api/orders';

const InvoiceGenerator = ({ orderData, isDark, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Parse the order data
  const orderId = orderData?.orderId || '';
  const order = orderData?.order || {};
  const items = order?.items || [];
  const apiResults = order?.apiResults || [];
  const description = order?.description ? JSON.parse(order.description) : {};

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate PDF directly
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // First, fetch the latest order status
      console.log('Fetching latest order status for orderId:', orderId);
      const statusResponse = await getOrderStatus(orderId);
      
      if (statusResponse.success && statusResponse.order) {
        console.log('Order status updated successfully:', statusResponse.order);
        // Update the order data with the latest status
        orderData.order = statusResponse.order;
        // Re-parse the updated order data
        const updatedOrder = statusResponse.order;
        const updatedApiResults = updatedOrder?.apiResults || [];
        const updatedDescription = updatedOrder?.description ? JSON.parse(updatedOrder.description) : {};
        
        // Update local variables with fresh data
        Object.assign(order, updatedOrder);
        apiResults.length = 0;
        apiResults.push(...updatedApiResults);
        Object.assign(description, updatedDescription);
      } else {
        console.warn('Failed to fetch updated order status, using existing data:', statusResponse.error);
      }

      // Create PDF in isolated scope to prevent affecting other pages
      await generatePDFContent();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Isolated PDF generation function to prevent affecting other pages
  const generatePDFContent = async () => {
    return new Promise((resolve) => {
      try {
        // Create PDF with text content (no image conversion) - isolated scope
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yPosition = 25; // Starting Y position
        
        // Helper function to add text with proper formatting (isolated to PDF only)
      const addText = (text, x, y, options = {}) => {
        const fontSize = options.fontSize || 10;
        const fontStyle = options.fontStyle || 'normal';
        const align = options.align || 'left';
        
        // Set font properties only for this PDF instance
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(options.color || '#000000');
        
        if (align === 'center') {
          pdf.text(text, x, y, { align: 'center' });
        } else if (align === 'right') {
          pdf.text(text, x, y, { align: 'right' });
        } else {
          pdf.text(text, x, y);
        }
      };

      // Helper function to add line
      const addLine = (x1, y1, x2, y2, lineWidth = 0.5) => {
        pdf.setDrawColor('#cccccc');
        pdf.setLineWidth(lineWidth);
        pdf.line(x1, y1, x2, y2);
      };

      // Helper function to add rectangle
      const addRect = (x, y, width, height, fillColor = null) => {
        if (fillColor) {
          pdf.setFillColor(fillColor);
          pdf.rect(x, y, width, height, 'F');
        } else {
          pdf.setDrawColor('#cccccc');
          pdf.setLineWidth(0.5);
          pdf.rect(x, y, width, height);
        }
      };

      // Header Section
      addText('INVOICE', pageWidth / 2, yPosition, { 
        fontSize: 20, 
        fontStyle: 'bold',
        align: 'center'
      });
      yPosition += 8;
      
      addText('Topup Mania Gaming', pageWidth / 2, yPosition, { 
        fontSize: 14, 
        fontStyle: 'bold',
        align: 'center'
      });
      yPosition += 5;
      
      addText('Your Trusted Gaming Partner | Email: topupmania@gmail.com', pageWidth / 2, yPosition, { 
        fontSize: 9,
        align: 'center'
      });
      yPosition += 12;
      
      // Header line
      addLine(margin, yPosition, pageWidth - margin, yPosition, 1);
      yPosition += 10;

      // Two-column layout for details
      const leftColX = margin;
      const rightColX = pageWidth / 2 + 10;
      const detailsStartY = yPosition;
      
      // Left column - Invoice Details
      addText('Invoice Details', leftColX, yPosition, { 
        fontSize: 12, 
      });
      yPosition += 6;
      
      const invoiceDetails = [
        ['Invoice No:', (orderId).slice(-8)],
        ['Date:', formatDate(order.createdAt)],
        ['Status:', order.status.charAt(0).toUpperCase() + order.status.slice(1)],
        ['Payment Method:', order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)]
      ];
      
      invoiceDetails.forEach(([label, value]) => {
        addText(label, leftColX, yPosition, { fontSize: 9 });
        addText(value, leftColX + 35, yPosition, { fontSize: 9, fontStyle: 'bold' });
        yPosition += 4;
      });
      
      // Right column - Customer Details
      let rightColY = detailsStartY;
      addText('Customer Details', rightColX, rightColY, { 
        fontSize: 12, 
        fontStyle: 'bold'
      });
      rightColY += 6;
      
      const customerDetails = [
        ['Character ID:', description.playerId || 'N/A'],
        ['Server ID:', description.server || 'N/A'],
        ['Game:', description.text || 'Gaming Purchase']
      ];
      
      customerDetails.forEach(([label, value]) => {
        addText(label, rightColX, rightColY, { fontSize: 9 });
        addText(value, rightColX + 30, rightColY, { fontSize: 9, fontStyle: 'bold' });
        rightColY += 4;
      });
      
      yPosition = Math.max(yPosition, rightColY) + 10;
      
      // Items Table
      addText('Order Items', margin, yPosition, { 
        fontSize: 12, 
        fontStyle: 'bold'
      });
      yPosition += 8;
      
      // Table header background
      addRect(margin, yPosition - 2, pageWidth - 2 * margin, 8, '#f5f5f5');
      
        // Table headers with better spacing and alignment
        const tableHeaders = ['Item', 'Description', 'Qty', 'Price', 'Total'];
        const colPositions = [margin + 2, margin + 50, margin + 110, margin + 135, margin + 160];
        const colWidths = [45, 55, 20, 20, 25]; // Column widths for better spacing
      
        tableHeaders.forEach((header, index) => {
          let xPos = colPositions[index];
          let align = 'left';
          
          // Right align headers for numeric columns
          if (index === 2) { // Qty header
            xPos = colPositions[index] + 15;
            align = 'right';
          } else if (index === 3) { // Price header
            xPos = colPositions[index] + 18;
            align = 'right';
          } else if (index === 4) { // Total header
            xPos = colPositions[index] + 23;
            align = 'right';
          }
          
          addText(header, xPos, yPosition + 3, { 
            fontSize: 9, 
            fontStyle: 'bold',
            align: align
          });
        });
      
      yPosition += 8;
      addLine(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 3;
      
        // Table rows with proper alignment
        items.forEach((item, index) => {
          const rowData = [
            item.itemName || 'Gaming Item',
            (item.itemName || 'Gaming Purchase').substring(0, 20), // Truncate long descriptions
            item.quantity.toString(),
            `Rs.${item.price}`, // Use Rs. instead of ₹ for better PDF compatibility
            `Rs.${item.price * item.quantity}`
          ];
          
          // Alternate row background
          if (index % 2 === 1) {
            addRect(margin, yPosition - 1, pageWidth - 2 * margin, 6, '#fafafa');
          }
          
          rowData.forEach((cellData, colIndex) => {
            let xPos = colPositions[colIndex];
            let align = 'left';
            
            // Right align quantity, price, and total columns
            if (colIndex === 2) { // Qty column
              xPos = colPositions[colIndex] + 15;
              align = 'right';
            } else if (colIndex === 3) { // Price column
              xPos = colPositions[colIndex] + 18;
              align = 'right';
            } else if (colIndex === 4) { // Total column
              xPos = colPositions[colIndex] + 23;
              align = 'right';
            }
            
            addText(cellData, xPos, yPosition + 2, { 
              fontSize: 8,
              align: align
            });
          });
          
          yPosition += 6;
        });
      
      yPosition += 5;
      
      // Total section with background
      addLine(margin, yPosition, pageWidth - margin, yPosition, 1);
      yPosition += 8;
      
      // Total amount box
      const totalBoxY = yPosition;
      addRect(pageWidth - 70, totalBoxY, 55, 15, '#f0f9ff');
      
        addText('Total Amount:', pageWidth - 68, yPosition + 4, { 
          fontSize: 10, 
          fontStyle: 'bold'
        });
        addText(`Rs.${order.amount}`, pageWidth - 18, yPosition + 4, { 
          fontSize: 14, 
          fontStyle: 'bold',
          align: 'right'
        });
      
      addText(`Currency: ${order.currency}`, pageWidth - 68, yPosition + 10, { 
        fontSize: 8
      });
      
      yPosition += 25;
      
      // Footer section
      addLine(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      addText('Thank you for your purchase!', pageWidth / 2, yPosition, { 
        fontSize: 10,
        fontStyle: 'bold',
        align: 'center'
      });
      yPosition += 5;
      
      addText('For support, contact us at support@topupmania.com', pageWidth / 2, yPosition, { 
        fontSize: 9,
        align: 'center'
      });
      yPosition += 5;
      

      // Generate filename
      const filename = `Invoice_${order._id}_${new Date().toISOString().split('T')[0]}.pdf`;
      
        // Download the PDF
        pdf.save(filename);
        
        // Resolve the promise to complete the isolated PDF generation
        resolve();
      } catch (error) {
        console.error('Error in PDF generation:', error);
        resolve(); // Resolve even on error to prevent hanging
      }
    });
  };


  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium text-xs transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
        isDark 
          ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
      }`}
    >
      {isGenerating ? (
        <>
          <FaSpinner className="w-3 h-3 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FaFileInvoice className="w-3 h-3" />
          Download Invoice
        </>
      )}
    </button>
  );
};

export default InvoiceGenerator;
