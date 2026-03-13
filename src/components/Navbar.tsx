import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Zap, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const isDesign = location.pathname === '/';

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md',
        isDesign ? 'border-[#00D9FF]/10 bg-[#0A1929]/90' : 'bg-card/80'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap className={cn('h-6 w-6', isDesign ? 'text-[#00D9FF]' : 'text-primary')} />
            <span
              className={cn(
                isDesign ? 'text-[#00D9FF]' : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
              )}
            >
              Multisense
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {[
              { path: '/', label: 'Design' },
              { path: '/community', label: 'Community' },
              { path: '/my-presets', label: 'My Presets' },
            ].map(({ path, label }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? 'secondary' : 'ghost'}
                  size="sm"
                  className={
                    isDesign && isActive(path)
                      ? 'bg-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/30'
                      : isDesign && !isActive(path)
                        ? 'text-white/70 hover:bg-white/10 hover:text-white'
                        : undefined
                  }
                >
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-2',
                    isDesign && 'text-white/90 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button
                size="sm"
                className={isDesign ? 'bg-[#00D9FF] text-[#0A1929] hover:bg-[#00D9FF]/90' : undefined}
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
