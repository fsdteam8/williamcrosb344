import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1 className='text-white'>Dashboard Layout</h1>
      <Outlet />
    </div>
  );
}

export default Dashboard;