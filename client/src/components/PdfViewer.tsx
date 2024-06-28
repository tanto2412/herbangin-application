// PDFViewer.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { fetchReport } from '../dataHandling/API_laporan'

const PDFViewer: React.FC = () => {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const onBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        if (params.jenis && params.id) {
          const response = await fetchReport(
            params.jenis,
            params.id,
            searchParams,
          )

          setPdfData(response)
        }
      } catch (error) {
        console.error('Error fetching PDF:', error)
      }
    }

    fetchPDF()
  }, [params, searchParams])

  const getBase64 = (arrayBuffer: ArrayBuffer) => {
    let binary = ''
    const bytes = new Uint8Array(arrayBuffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const handleDownload = () => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'rekap_piutang.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url) // Clean up the URL object
    }
  }

  return (
    <>
      <button
        className="btn btn-sm btn-outline-success mb-2"
        type="button"
        onClick={onBack}
      >
        Kembali Ke Filter
      </button>
      <button
        className="btn btn-sm btn-outline-primary mb-2 mx-2"
        type="button"
        onClick={handleDownload}
        disabled={!pdfData} // Disable button if pdfData is not yet loaded
      >
        Download PDF
      </button>
      {pdfData && (
        <embed
          src={`data:application/pdf;base64,${getBase64(pdfData)}`}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      )}
    </>
  )
}

export default PDFViewer
