import "./FormSelect.scss"; 

const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // { value: 'val', label: 'Label' } veya { id: 'val', name: 'Label' } formatında
  defaultOptionText = "Seçiniz", // İlk, genellikle devre dışı olmayan seçenek
  disabledOptionText = "Veri bulunamadı", // Seçenekler boşsa gösterilecek metin
  required = false,
  error,
  className = "", // Ekstra CSS sınıfları için
  ...rest // Diğer select propları (örn: disabled)
}) => {
  const selectId = id || name;

  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={selectId}>{label}</label>}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`${error ? "error" : ""} form-select`} // .form-select sınıfını ekliyoruz
        {...rest}
      >
        {defaultOptionText && <option value=''>{defaultOptionText}</option>}
        {options.length > 0
          ? options.map((option) => (
              <option
                key={option.id || option.value}
                value={option.id || option.value}
              >
                {option.name || option.label}
              </option>
            ))
          : defaultOptionText && (
              <option value='' disabled>
                {disabledOptionText}
              </option>
            )}
      </select>
      {error && <span className='input-error'>{error}</span>}
    </div>
  );
};

export default FormSelect;
