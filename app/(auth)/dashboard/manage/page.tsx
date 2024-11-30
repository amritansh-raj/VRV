'use client';

import withAuth from '@/components/hoc/withAuth';
import UserTable from '@/components/table/UserTable';

const Page = () => {
  return <UserTable />;
};

export default withAuth(Page, ['admin']);
