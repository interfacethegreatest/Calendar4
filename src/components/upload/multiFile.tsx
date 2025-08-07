'use client';

import { cn } from '@/lib/utils';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  FileIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import * as React from 'react';
import { type DropzoneOptions } from 'react-dropzone';
import { Dropzone } from './dropzone';
import { ProgressBar } from './progress-bar';
import { formatFileSize, useUploader } from './uploader-provider';

/**
 * Displays a list of files with their upload status, progress, and controls.
 */
const FileList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { fileStates, removeFile, cancelUpload } = useUploader();

  if (!fileStates.length) return null;

  return (
    <div
      ref={ref}
      className={cn('mt-3 flex w-full flex-col gap-2', className)}
      {...props}
    >
      {fileStates.map(({ file, abortController, progress, status, key }) => (
        <div
          key={key}
          className="shadow-xs flex flex-col justify-center rounded border border-gray-200 px-4 py-3 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <FileIcon className="h-8 w-8 shrink-0 text-gray-500 dark:text-gray-400" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <div className="truncate text-sm">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </div>
                </div>

                <div className="ml-2 flex items-center gap-2">
                  {status === 'ERROR' && (
                    <div className="flex items-center text-xs text-red-500 dark:text-red-400">
                      <AlertCircleIcon className="mr-1 h-4 w-4" />
                    </div>
                  )}

                  {status === 'UPLOADING' && (
                    <div className="flex flex-col items-end">
                      {abortController && (
                        <button
                          type="button"
                          className="rounded-md p-0.5 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          disabled={progress === 100}
                          onClick={() => cancelUpload(key)}
                        >
                          <XIcon className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                      <div>{Math.round(progress)}%</div>
                    </div>
                  )}

                  {status !== 'UPLOADING' && status !== 'COMPLETE' && (
                    <button
                      type="button"
                      className="rounded-md p-1 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
                      onClick={() => removeFile(key)}
                      title="Remove"
                    >
                      <Trash2Icon className="block h-4 w-4 shrink-0" />
                    </button>
                  )}

                  {status === 'COMPLETE' && (
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-500 dark:text-blue-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {status === 'UPLOADING' && <ProgressBar progress={progress} />}
        </div>
      ))}
    </div>
  );
});
FileList.displayName = 'FileList';

export interface FileUploaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  maxFiles?: number;
  maxSize?: number;
  accept?: DropzoneOptions['accept'];
  disabled?: boolean;
  dropzoneClassName?: string;
  fileListClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onFilesSelected?: (files: File[]) => void;
}

/**
 * A complete file uploader component with dropzone and file list.
 */
const FileUploader = React.forwardRef<HTMLDivElement, FileUploaderProps>(
  (
    {
      maxFiles,
      maxSize,
      accept,
      disabled,
      className,
      dropzoneClassName,
      fileListClassName,
      inputRef,
      onFilesSelected,
      ...props
    },
    ref,
  ) => {
    const { addFiles } = useUploader();

    // Wrap files selected handler to update internal state and call external callback
    const handleFilesSelected = (files: File[]) => {
      if (onFilesSelected) {
        onFilesSelected(files);
      }
      addFiles(files);
    };

    return (
      <div ref={ref} className={cn('w-full space-y-4', className)} {...props}>
        <Dropzone
          ref={inputRef}
          dropzoneOptions={{
            maxFiles,
            maxSize,
            accept,
          }}
          disabled={disabled}
          className={dropzoneClassName}
          onFilesSelected={handleFilesSelected} // Use wrapped handler here
        />

        <FileList className={fileListClassName} />
      </div>
    );
  },
);
FileUploader.displayName = 'FileUploader';

export { FileList, FileUploader };
