import LoginForm from '../LoginForm';

export default function LoginFormExample() {
  return (
    <LoginForm onLogin={(id) => console.log('Logged in as:', id)} />
  );
}
