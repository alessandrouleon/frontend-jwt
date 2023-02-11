
import styles from '@/styles/Home.module.css'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext';


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



const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};


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
