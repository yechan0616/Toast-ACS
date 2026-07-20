import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        textAlign: 'center',
        gap: '12px',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '20px' }}>페이지를 찾을 수 없어요</h1>
        <p style={{ marginTop: '8px' }}>
          <Link href='/'>처음으로 돌아가기</Link>
        </p>
      </div>
    </main>
  )
}
