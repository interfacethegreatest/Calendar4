'use client';

import * as React from 'react';

// Types
export type FileStatus = 'PENDING' | 'UPLOADING' | 'COMPLETE' | 'ERROR';

export type FileState = {
  file: File;
  key: string;
  progress: number;
  status: FileStatus;
  url?: string;
  error?: string;
  abortController?: AbortController;
  autoUpload?: boolean;
};

export type CompletedFileState = Omit<FileState, 'status' | 'url'> & {
  status: 'COMPLETE';
  url: string;
};

export type UploadFn<TOptions = unknown> = (props: {
  file: File;
  signal: AbortSignal;
  onProgressChange: (progress: number) => void | Promise<void>;
  options?: TOptions;
}) => Promise<{ url: string }>;

type UploaderContextType<TOptions = unknown> = {
  fileStates: FileState[];
  addFiles: (files: File[]) => void;
  updateFileState: (key: string, changes: Partial<FileState>) => void;
  removeFile: (key: string) => void;
  cancelUpload: (key: string) => void;
  uploadFiles: (keysToUpload?: string[], options?: TOptions) => Promise<void>;
  resetFiles: () => void;
  isUploading: boolean;
  autoUpload?: boolean;
};

type ProviderProps<TOptions = unknown> = {
  children:
    | React.ReactNode
    | ((context: UploaderContextType<TOptions>) => React.ReactNode);
  onChange?: (args: {
    allFiles: FileState[];
    completedFiles: CompletedFileState[];
  }) => void | Promise<void>;
  onFileAdded?: (file: FileState) => void | Promise<void>;
  onFileRemoved?: (key: string) => void | Promise<void>;
  onUploadCompleted?: (file: CompletedFileState) => void | Promise<void>;
  uploadFn: UploadFn<TOptions>;
  value?: FileState[];
  autoUpload?: boolean;
};

// Context
const UploaderContext =
  React.createContext<UploaderContextType<unknown> | null>(null);

export function useUploader<TOptions = unknown>() {
  const context = React.useContext(UploaderContext);
  if (!context) {
    throw new Error('useUploader must be used within a UploaderProvider');
  }
  return context as UploaderContextType<TOptions>;
}

export function UploaderProvider<TOptions = unknown>({
  children,
  onChange,
  onFileAdded,
  onFileRemoved,
  onUploadCompleted,
  uploadFn,
  value: externalValue,
  autoUpload = false,
}: ProviderProps<TOptions>) {
  const [fileStates, setFileStates] = React.useState<FileState[]>(
    externalValue ?? [],
  );

  // Sync external value
  React.useEffect(() => {
    if (externalValue) {
      setFileStates(externalValue);
    }
  }, [externalValue]);

  const updateFileState = React.useCallback(
    (key: string, changes: Partial<FileState>) => {
      setFileStates((prevStates) =>
        prevStates.map((fs) => (fs.key === key ? { ...fs, ...changes } : fs)),
      );
    },
    [],
  );

  const uploadFiles = React.useCallback(
    async (keysToUpload?: string[], options?: TOptions) => {
      const filesToUpload = fileStates.filter(
        (fs) =>
          fs.status === 'PENDING' &&
          (!keysToUpload || keysToUpload.includes(fs.key)),
      );

      if (filesToUpload.length === 0) return;

      await Promise.all(
        filesToUpload.map(async (fs) => {
          try {
            const abortController = new AbortController();
            updateFileState(fs.key, {
              abortController,
              status: 'UPLOADING',
              progress: 0,
            });

            const result = await uploadFn({
              file: fs.file,
              signal: abortController.signal,
              onProgressChange: (progress) =>
                updateFileState(fs.key, { progress }),
              options,
            });

            await new Promise((res) => setTimeout(res, 500)); // smooth finish

            const completed: CompletedFileState = {
              ...fs,
              status: 'COMPLETE',
              progress: 100,
              url: result.url,
            };

            updateFileState(fs.key, completed);

            if (onUploadCompleted) {
              void onUploadCompleted(completed);
            }
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'Upload failed';

            const isAbort =
              err instanceof Error &&
              (err.name === 'AbortError' || err.name === 'UploadAbortedError');

            updateFileState(fs.key, {
              status: isAbort ? 'PENDING' : 'ERROR',
              progress: 0,
              error: isAbort ? 'Upload canceled' : message,
            });
          }
        }),
      );
    },
    [fileStates, updateFileState, uploadFn, onUploadCompleted],
  );

  const addFiles = React.useCallback(
    (files: File[]) => {
      const newFileStates = files.map<FileState>((file) => ({
        file,
        key: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        progress: 0,
        status: 'PENDING',
        autoUpload,
      }));
      setFileStates((prev) => [...prev, ...newFileStates]);

      if (onFileAdded) {
        newFileStates.forEach((fileState) => {
          void onFileAdded(fileState);
        });
      }
    },
    [autoUpload, onFileAdded],
  );

  const removeFile = React.useCallback(
    (key: string) => {
      setFileStates((prev) => prev.filter((fs) => fs.key !== key));
      if (onFileRemoved) {
        void onFileRemoved(key);
      }
    },
    [onFileRemoved],
  );

  const cancelUpload = React.useCallback(
    (key: string) => {
      const fs = fileStates.find((f) => f.key === key);
      if (fs?.abortController && fs.progress < 100) {
        fs.abortController.abort();
        updateFileState(key, { status: 'PENDING', progress: 0 });
      }
    },
    [fileStates, updateFileState],
  );

  const resetFiles = React.useCallback(() => {
    setFileStates([]);
  }, []);

  React.useEffect(() => {
    const completed = fileStates.filter(
      (fs): fs is CompletedFileState => fs.status === 'COMPLETE' && !!fs.url,
    );
    void onChange?.({ allFiles: fileStates, completedFiles: completed });
  }, [fileStates, onChange]);

  const isUploading = React.useMemo(
    () => fileStates.some((fs) => fs.status === 'UPLOADING'),
    [fileStates],
  );

  const value = React.useMemo(
    () => ({
      fileStates,
      addFiles,
      updateFileState,
      removeFile,
      cancelUpload,
      uploadFiles,
      resetFiles,
      isUploading,
      autoUpload,
    }),
    [
      fileStates,
      addFiles,
      updateFileState,
      removeFile,
      cancelUpload,
      uploadFiles,
      resetFiles,
      isUploading,
      autoUpload,
    ],
  );

  return (
    <UploaderContext.Provider value={value as UploaderContextType<unknown>}>
      {typeof children === 'function' ? children(value) : children}
    </UploaderContext.Provider>
  );
}

// Utility
export function formatFileSize(bytes?: number) {
  if (!bytes) return '0 B';
  const k = 1024;
  const dm = 2;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
