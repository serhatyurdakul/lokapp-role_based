# Modal Davranışı (Web + Mobil Referansı)

## Overlay Tıklayınca Kapanma (`closeOnOverlayClick`)

- `GenericModal` (`src/common/components/modals/GenericModal/GenericModal.jsx`): varsayılan `true`
- `ConfirmModal` (`src/common/components/modals/ConfirmModal/ConfirmModal.jsx`)
  - `variant="destructive"`: `false`
  - diğer durumlar: `true`
- `DiscardChangesModal` (`src/common/components/modals/DiscardChangesModal/DiscardChangesModal.jsx`): `false`
- `UpdateMealModal` (`src/features/restaurant/components/UpdateMealModal/UpdateMealModal.jsx`): `false`
- Karar / state değiştiren modallar (2 aksiyon): kullanımda `false`
  - `src/features/customer/pages/Ordering/OrderScreen.jsx`
  - `src/features/restaurant/pages/OrderDetail/OrderDetailPage.jsx`
  - `src/features/customer/components/OrderActionsModal/OrderActionsModal.jsx` (iptal onayı adımı)

## Discard Standardı (Metin + Buton Tonu)

- Primary (güvenli): **“Geri dön”** (`secondary`)
- Secondary (riskli): **“Çık”** (`destructive-outline`)

## Destructive Alert Düzeni

- Sol: riskli/destructive (kırmızı)
- Sağ: güvenli (`secondary`)
