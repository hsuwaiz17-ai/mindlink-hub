import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onTextSubmit: (text: string) => void;
  onImageSubmit: (file: File) => void;
  onFileSubmit: (file: File) => void;
}

export default function ContentInput({
  onTextSubmit,
  onImageSubmit,
  onFileSubmit,
}: Props) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <Textarea
        ref={textRef}
        placeholder="စာသားရေးပါ..."
        rows={5}
      />

      <Button
        className="w-full"
        onClick={() => {
          if (textRef.current?.value) {
            onTextSubmit(textRef.current.value);
          }
        }}
      >
        စာသားတင်မယ်
      </Button>

      {/* Image */}
      <input
        type="file"
        ref={imageRef}
        accept="image/*"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onImageSubmit(e.target.files[0]);
          }
        }}
      />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => imageRef.current?.click()}
      >
        Image တင်မယ်
      </Button>

      {/* File */}
      <input
        type="file"
        ref={fileRef}
        accept=".pdf,.doc,.docx,.txt"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileSubmit(e.target.files[0]);
          }
        }}
      />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileRef.current?.click()}
      >
        File တင်မယ်
      </Button>
    </div>
  );
}
