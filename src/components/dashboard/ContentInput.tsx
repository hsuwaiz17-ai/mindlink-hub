const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const newFiles = Array.from(files);
  
  // Image ဟုတ်မဟုတ် စစ်ဆေးခြင်း
  const invalidFile = newFiles.find(file => !file.type.startsWith("image/"));
  if (invalidFile) {
    toast.error("Please select image files only");
    return;
  }

  try {
    // ပုံအားလုံးကို တစ်ပြိုင်နက်ဖတ်ပြီး Preview URL များ ပြောင်းလဲခြင်း
    const previewPromises = newFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const newImagePreviews = await Promise.all(previewPromises);

    // State များကို Update လုပ်ခြင်း
    setSelectedImages((prev) => [...prev, ...newImagePreviews]);
    onImagesSelected?.(newFiles);
    
    // Scan ရိုက်ရင် scan mode မှာပဲ ဆက်ရှိနေစေပြီး Gallery ဆိုရင် upload mode သို့ ပြောင်းပါမည်
    setActiveMode(isCamera ? "scan" : "upload");

  } catch (error) {
    console.error("Error reading files:", error);
    toast.error("Failed to process some images");
  } finally {
    // Input ကို reset လုပ်မှ နောက်တစ်ခါ ပုံထပ်တင်ရင် အလုပ်လုပ်မှာပါ
    e.target.value = "";
  }
};
