"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface FileUploaderProps {
  files: File[]
  setFiles: (files: File[]) => void
}

export function FileUploader({ files, setFiles }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
    },
    [setFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center cursor-pointer hover:bg-primary/5 transition-colors duration-200"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-primary">Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-primary">Uploaded files:</h4>
          <ul className="list-disc pl-5">
            {files.map((file) => (
              <li key={file.name} className="text-sm">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

