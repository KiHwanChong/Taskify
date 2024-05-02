import dynamic from 'next/dynamic';

const DashboardListItem = dynamic(() => import('./DashboardListItem'), { ssr: false });

const DashboardList = () => {
  return (
    <div className="select-none flex my-16 flex-col mobile:gap-30 mobile:translate-x-7">
      <DashboardListItem />
    </div>
  );
};

export default DashboardList;
