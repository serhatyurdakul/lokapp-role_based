import "./PageHeader.scss";

const PageHeader = ({ title, children }) => {
  return (
    <header className='page-header'>
      <h1>{title}</h1>
      {children && <div className='page-header-actions'>{children}</div>}
    </header>
  );
};

export default PageHeader;
