import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import useSWR from 'swr'
import { useState } from 'react'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  // get bitcoin price
  const { data, error, mutate } = useSWR('query { bitcoin { getBitcoinPrice } }', (query) => fetch('http://localhost:3000/api/hello', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  }).then(res => res.json()))
  const isLoading = !data && !error
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  
  // Set name to mutate in state
  const [nameToMutate, setNameToMutate] = useState(data.name);
  const [showEdit, setShowEdit] = useState(false);

  const handleShowEdit = () => {
    setShowEdit(!showEdit)
  }

  // mutate data
  const handleSave = async () => {
    // if name is not okay, return
    if (!isNameOkay()) 
      
    // mutate data
    mutate({ ...data, name: nameToMutate }, false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNameToMutate(e.target.value)
  }

  const isNameOkay = () => {
    return nameToMutate.length > 0 && nameToMutate.length < 20
  }
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        { data.name}
        <button onClick={handleSave}>Change Name</button>
        <button onClick={() => mutate()}>Reset Name</button>
        <button onClick={handleShowEdit}>Edit Name</button>

        { showEdit && <input type="text" className={styles.input} value={nameToMutate} onChange={handleChange}/>}
      </main>
    </>
  )
}


