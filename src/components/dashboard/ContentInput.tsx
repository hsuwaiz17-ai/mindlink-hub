const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      
      const invalidFile = newFiles.find(file => !file.type.startsWith("image/"));
      if (invalidFile) {
        toast.error("Please select image files only");
        return;
      }

      const newImagePreviews: string[] = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newImagePreviews.push(reader.result as string);
          if (newImagePreviews.length === newFiles.length) {
            setSelectedImages(prev => [...prev, ...newImagePreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      onImagesSelected?.(newFiles);
      
      // ဒီနေရာလေးကို ပြင်လိုက်ပါ
      // Scan ရိုက်ရင် scan mode မှာပဲ ဆက်ရှိနေစေဖို့ပါ
      if (isCamera) {
        setActiveMode("scan");
      } else {
        setActiveMode("upload");
      }
    }
    e.target.value = ""; 
  };
