'use client';

import withAuth from '@/components/hoc/withAuth';
import UserPermissionsTable from '@/components/table/PermissionsTable';

const Page = () => {
  return <UserPermissionsTable />;
};

export default withAuth(Page, ['manager']);
