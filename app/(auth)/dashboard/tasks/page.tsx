'use client';

import withAuth from '@/components/hoc/withAuth';
import TaskTable from '@/components/table/TaskTable';

const Page = () => {
  return <TaskTable />;
};

export default withAuth(Page, ['user']);
