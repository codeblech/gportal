import { NavLink } from 'react-router-dom';
import { BarChart3, Bell, ChartSpline, Table2, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { name: 'ATTENDANCE', path: '/attendance', icon: BarChart3 },
    { name: 'ALERTS', path: '/alerts', icon: Bell },
    { name: 'GRADES', path: '/grades', icon: ChartSpline },
    { name: 'TIME TABLE', path: '/timetable', icon: Table2 },
    { name: 'PROFILE', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 flex w-screen items-center justify-between gap-1 bg-muted px-2 py-4 sm:gap-0 sm:px-4">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 overflow-hidden text-clip whitespace-nowrap text-sm text-muted-foreground ${
              isActive ? 'opacity-100' : 'opacity-70'
            }`
          }
        >
          {({ isActive }) => {
            const Icon = item.icon;
            return (
              <div className="flex flex-col items-center">
                <div
                  className={`flex w-full items-center justify-center rounded-xl p-1 hover:bg-primary ${
                    isActive ? 'bg-primary' : ''
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                  />
                </div>
                <p className="text-left text-xs max-[370px]:text-[0.6rem] max-[390px]:text-[0.7rem]">
                  {item.name}
                </p>
              </div>
            );
          }}
        </NavLink>
      ))}
    </div>
  );
}
