export function useFileUpload() {
    const validateFile = (file: File, options: {
        maxSize?: number // in bytes
        allowedTypes?: string[]
    } = {}) => {
        const errors: string[] = []

        // Check file size
        if (options.maxSize && file.size > options.maxSize) {
            const maxSizeMB = options.maxSize / (1024 * 1024)
            errors.push(`Ukuran file maksimal ${maxSizeMB}MB`)
        }

        // Check file type
        if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
            errors.push(`Tipe file tidak diizinkan. Hanya: ${options.allowedTypes.join(', ')}`)
        }

        return {
            valid: errors.length === 0,
            errors
        }
    }

    const downloadFile = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(url)
    }

    const getFileExtension = (filename: string): string => {
        return filename.split('.').pop()?.toLowerCase() || ''
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'

        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return {
        validateFile,
        downloadFile,
        getFileExtension,
        formatFileSize
    }
}
