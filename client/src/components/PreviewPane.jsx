import { useState } from 'react'
import ResumePreview from './templates/index.js'

export default function PreviewPane({ template, accent, font, content, sectionOrder, hiddenSections }) {
  const [zoom, setZoom] = useState(0.72)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live preview</span>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.08).toFixed(2)))}
            className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            −
          </button>
          <span className="w-10 text-center font-medium text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.08).toFixed(2)))}
            className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-slate-100 p-6 print-area dark:bg-slate-900">
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
