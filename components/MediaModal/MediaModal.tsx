import Modal from "@/components/Modal/Modal"


export type MediaType = {
  id: string
  title: string
  url: string
  thumbnail: string
}

export type MediaModalType = {
  open?: boolean
  type: boolean
  url: string
  title?: string
}

export type MediaModalState =
  | { open: false }
  | { open: true; type: 'video'; url: string }
  | { open: true; type: 'press'; url: string; title: string }

// Props for the MediaPage component
interface MediaPageProps {
  modal: MediaModalState
  setModal: React.Dispatch<React.SetStateAction<MediaModalState>>
}

export default function MediaModal({ modal, setModal }: MediaPageProps) {

  return (
    <Modal open={modal.open} onClose={() => setModal({ open: false })}>
      {modal.open && modal.type === 'video' && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '1.1rem' }}>
          <iframe
            src={modal.url.replace('watch?v=', 'embed/').replace('&t=', '?start=')}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              borderRadius: '1.1rem'
            }}
          />
        </div>
      )}
      {modal.open && modal.type === 'press' && (
        <div style={{ minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.13rem', marginBottom: 10 }}>{modal.title}</h2>
          <iframe
            src={modal.url}
            style={{ width: '100%', minHeight: 400, border: 'none', borderRadius: 8 }}
            title={modal.title}
          />
          <a href={modal.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 18, color: '#e11d48', fontWeight: 600 }}>
            PDF indir / yeni sekmede aç
          </a>
        </div>
      )}
    </Modal>
  )
}