import { useState } from 'react'
import ResumePreview from './templates/index.js'

export default function PreviewPane({ template, accent, font, content, sectionOrder, hiddenSections }) {
  const [zoom, setZoom] = useState(0.72)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--border-1)] bg-[var(--bg-2)] px-4 py-2.5">
        <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
          Live preview
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.08).toFixed(2)))}
            className="btn btn-ghost btn-sm btn-icon"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <span className="w-10 text-center text-xs font-mono" style={{ color: 'var(--text-1)' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.08).toFixed(2)))}
            className="btn btn-ghost btn-sm btn-icon"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[var(--bg-1)] p-5 print-area">
        <ResumePreview
          template={template}
          accent={accent}
          font={font}
          content={content}
          scale={zoom}
          sectionOrder={sectionOrder}
          hiddenSections={hiddenSections}
        />
      </div>
    </div>
  )
}
