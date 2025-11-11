import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/user/useLogout';

export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button onClick={() => logout()} disabled={isPending}>
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
};
