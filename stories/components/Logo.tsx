export default function Logo(): JSX.Element {
  // @ts-ignore
  const URL = import.meta.env.MODE === 'development' ? '../../assets' : './'

  return (
    <div style={{ marginBottom: 24 }}>
      <img src={`${URL}/icon.png`} width={100} alt='logo' />
      <h1 style={{ fontSize: 46, fontWeight: 600, letterSpacing: -1 }}>
        Dashup
      </h1>
    </div>
  )
}
