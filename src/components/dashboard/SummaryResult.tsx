const handleExportPDF = async () => {
    if (!resultRef.current) return;
    
    setIsExporting(true);
    try {
      // ၁။ Screen ပေါ်က ပုံစံအတိုင်း ပုံရိပ်ဖမ်းယူခြင်း
      const canvas = await htmlToImage.toCanvas(resultRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2, // စာသားကြည်လင်စေရန်
      });

      const imgData = canvas.toDataURL("image/png");
      
      // ၂။ PDF တည်ဆောက်ခြင်း (A4 size)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // ပုံရဲ့ အချိုးအစားကို တွက်ချက်ခြင်း
      const imgWidth = pdfWidth - 20; // Margin 10mm left/right
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // ၃။ PDF ထဲသို့ ပုံထည့်ခြင်း (စာသားပုံစံမပျက်စေရန်)
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      
      pdf.save(`mindlink-summary-${Date.now()}.pdf`);
      
      toast.success("PDF exported with original formatting");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };
