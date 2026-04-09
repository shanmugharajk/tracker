import { SigninForm } from './sigin-form';

export default function Signin() {
  return (
    <main className="min-h-screen flex justify-center md:justify-end pt-16 px-4">
      <div className="w-full max-w-md">
        <SigninForm />
      </div>
    </main>
  );
}
