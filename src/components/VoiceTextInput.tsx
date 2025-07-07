import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/use-voice-recognition";
import { cn } from "@/lib/utils";

interface VoiceTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceTextInput({ value, onChange, placeholder, className }: VoiceTextInputProps) {
  const { isListening, transcript, isSupported, startListening, stopListening } = useVoiceRecognition();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (transcript) {
      const newValue = localValue ? `${localValue} ${transcript}` : transcript;
      setLocalValue(newValue);
      onChange(newValue);
    }
  }, [transcript]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Textarea
          value={localValue}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="min-h-[100px] pr-12"
        />
        {isSupported && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8",
              isListening && "text-destructive"
            )}
            onClick={toggleListening}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {isListening && (
        <p className="text-sm text-muted-foreground">
          Listening... Click the microphone to stop recording.
        </p>
      )}
      {!isSupported && (
        <p className="text-sm text-muted-foreground">
          Voice input is not supported in your browser. Please type your response.
        </p>
      )}
    </div>
  );
}