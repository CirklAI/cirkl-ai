"use client";

import React, { useState, useCallback, DragEvent, ChangeEvent, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

interface DropzoneProps {
  onFileChange: (file: File | null) => void;
}

export function Dropzone({ onFileChange }: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File | undefined) => {
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  }, [onFileChange]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    onFileChange(null);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
      if (inputRef.current) {
          inputRef.current.click();
      }
  }

  return (
    <div
      onClick={openFileDialog}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out
        ${isDragActive ? 'border-accent bg-accent/10' : 'border-border bg-card/50 hover:border-accent/80'}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        multiple={false}
      />
      {file ? (
        <div className="text-center">
          <File className="w-16 h-16 mx-auto text-white" />
          <p className="mt-4 text-lg font-medium text-white">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <button
            onClick={removeFile}
            className="absolute top-4 right-4 p-2 rounded-full bg-destructive/20 hover:bg-destructive/40 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-5 h-5 text-destructive" />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto text-accent" />
          <h2 className="mt-6 text-2xl font-bold text-white">
            {isDragActive ? 'Drop the file here ...' : 'Drag & drop a file or click to select'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Maximum file size is 500MB.
          </p>
        </div>
      )}
    </div>
  );
}