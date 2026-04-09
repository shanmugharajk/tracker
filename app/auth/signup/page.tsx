import { SignupForm } from './signup-form';

export default function Signup() {
  return (
    <main className="min-h-screen flex justify-center md:justify-end pt-16 px-4">
      <div className="flex w-full max-w-md flex-col gap-4">
        <SignupForm />
      </div>
    </main>
  );
}
