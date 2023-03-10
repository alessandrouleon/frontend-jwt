
import styles from '@/styles/Home.module.css'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext';
import { withSSRGest } from '@/utils/withSSRGest';


export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const data = {
      email,
      password
    }

    await signIn(data);

  }

  return (

    <form className={styles.container} onSubmit={handleSubmit} >
      <label className={styles.logo}>Login</label>

      <input
        type="email"
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder='Senha'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit'>Entrar</button>
    </form>
  )
}

export const getServerSideProps = withSSRGest(async (ctx) => {
  return {
    props: {}
  }
});
