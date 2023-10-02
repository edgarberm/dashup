export default function Logo(): JSX.Element {
  const URL =
    // @ts-ignore
    import.meta.env.MODE === 'development'
      ? '../../assets'
      : 'https://edgarberm.github.io/dashup'

  return (
    <div style={{ marginBottom: 24 }}>
      <img src={`${URL}/icon.png`} width={100} alt='logo' />
      <h1 style={{ fontSize: 46, fontWeight: 600, letterSpacing: -1 }}>
        Dashup
      </h1>
    </div>
  )
}
