import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
	import FormInput from "@/common/components/forms/FormInput/FormInput";
	import Button from "@/common/components/Button/Button";
	import ErrorMessage from "@/common/components/forms/ErrorMessage/ErrorMessage";
import ConfirmModal from "@/common/components/modals/ConfirmModal/ConfirmModal.jsx";
	import { setOrderCutoffTime } from "@/features/restaurant/store/restaurantInfoSlice";
	import "./OrderCutoffSettingsPage.scss";

const DEFAULT_CUTOFF = "11:00";

const OrderCutoffSettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { info } = useSelector((state) => state.restaurantInfo);
  const { user } = useSelector((state) => state.auth);

  const storedCutoff = useMemo(() => {
    return (
      info?.orderCutoffTime ||
      user?.restaurant?.orderCutoffTime ||
      DEFAULT_CUTOFF
    );
  }, [info?.orderCutoffTime, user?.restaurant?.orderCutoffTime]);

  const [cutoffTime, setCutoffTime] = useState(storedCutoff);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setCutoffTime(storedCutoff);
    setIsDirty(false);
    setValidationError("");
  }, [storedCutoff]);

  const handleTimeChange = (event) => {
    const nextValue = event.target.value;
    setCutoffTime(nextValue);
    setIsDirty(nextValue !== storedCutoff);
    if (validationError) {
      setValidationError("");
    }
  };

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardModal(true);
      return;
    }
    navigate(-1);
  };

  const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

  const handleSave = () => {
    if (!cutoffTime || !isValidTime(cutoffTime)) {
      setValidationError("Geçerli bir saat girin (örn. 11:30).");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      dispatch(setOrderCutoffTime(cutoffTime));
      setIsSaving(false);
      setIsDirty(false);
      navigate("/profile", {
        replace: true,
        state: { toast: "Sipariş kapanış saati güncellendi." },
      });
    }, 400);
  };

  return (
    <div className='order-cutoff-page has-fixed-bottom-cta'>
      <DetailPageHeader title='Sipariş Kapanış Saati' backPath='/profile' onBack={handleBack} />

      <section className='order-cutoff-page__content'>
        <p className='order-cutoff-page__lead'>
          Belirlediğiniz saat geldiğinde sipariş alımı kapanır.
        </p>

        <div className='order-cutoff-page__form'>
          <FormInput
            label='Sipariş kapanış saati'
            id='orderCutoffTime'
            name='orderCutoffTime'
            type='time'
            value={cutoffTime}
            onChange={handleTimeChange}
            required
            inputMode='numeric'
          />
          <p className='order-cutoff-page__helper'>
            24 saat formatında saat ve dakika girin (örn. 11:00).
          </p>
          <ErrorMessage message={validationError} />
        </div>
      </section>

      <div className='order-cutoff-page__cta fixed-cta'>
        <Button
          type='button'
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          loading={isSaving}
          loadingText='Kaydediliyor...'
        >
          Kaydet
        </Button>
        <Button
          type='button'
          variant='secondary'
          onClick={handleBack}
          disabled={isSaving}
        >
          Vazgeç
        </Button>
      </div>

	      {showDiscardModal && (
	        <ConfirmModal
	          isOpen={showDiscardModal}
	          onClose={() => setShowDiscardModal(false)}
	          title='Değişiklikler kaydedilmedi'
	          message='Kaydedilmemiş değişiklikleriniz silinecek. Çıkmak istiyor musunuz?'
	          confirmText='Çık'
	          cancelText='Geri dön'
	          onConfirm={() => navigate(-1)}
	        />
	      )}

	    </div>
	  );
	};

export default OrderCutoffSettingsPage;
