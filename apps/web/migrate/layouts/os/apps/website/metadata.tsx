import { useWebsite } from '@/hooks/use-website';
import { GeneralForm } from './components/meta-data/general-form';
import { PageOrderer } from './components/meta-data/page-editor';
// import FaviconGenerator from './meta-data/favicon-generator';

export function Metadata() {
  const { form } = useWebsite();

  return (
    <div className="flex flex-col gap-4 rounded-xl rounded-tl-none rounded-tr-none border p-4">
      <div>
        <div className="flex gap-4">
          <div className="flex-1">
            <PageOrderer />
          </div>
          <div className="flex-1">
            <GeneralForm form={form} />
          </div>
          <div className="flex-1">{/* <FaviconGenerator /> */}</div>
        </div>
      </div>
    </div>
  );
}
