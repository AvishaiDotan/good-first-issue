import Filter from './components/Filter'
import Header from './components/Header'

function App() {
  return (
    <>
      <main className='layout'>
        <Header />
        <Filter onFilter={() => console.log('Filtering...')} />
      </main>
    </>
  )
}

export default App
