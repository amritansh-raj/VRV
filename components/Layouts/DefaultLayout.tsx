'use client';

import { DefaultLayoutI } from '@/types/layout/DefaultLayoutI';
import { Toaster } from '../ui/toaster';

const DefaultLayout: React.FC<DefaultLayoutI> = ({ children }) => {
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return <div style={{ visibility: 'hidden' }} />;
  // }

  return (
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="light"
    //   enableSystem
    //   disableTransitionOnChange
    // >
    <>
      {children}
      <Toaster />
    </>
    // </ThemeProvider>
  );
};

export default DefaultLayout;
