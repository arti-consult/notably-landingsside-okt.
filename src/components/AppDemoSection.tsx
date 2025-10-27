import { ContainerScroll } from './ContainerScroll';

const AppDemoSection = () => {
  return (
    <div className="flex flex-col overflow-hidden relative">
      <ContainerScroll titleComponent={<></>}>
        <img
          src="https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1761569451415.svg"
          alt="App Dashboard Demo"
          className="hidden md:block w-full h-full object-cover object-left-top rounded-lg"
          draggable={false}
        />
        <img
          src="https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1761569451415.svg"
          alt="App Dashboard Demo"
          className="block md:hidden w-full h-full object-cover object-left-top rounded-lg"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
};

export default AppDemoSection;
