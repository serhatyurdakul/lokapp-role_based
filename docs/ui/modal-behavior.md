# Modal Davranisi (Web + Mobil Referansi)

Bu dokuman, modallar disina tiklayinca kapanip kapanmamasini netlestirir. Mobil ekiplerin kodu okumadan, ekranda ne olacagini hizlica anlamasi hedeflenmistir.

## Hizli Ozet
- Karar, veri kaybi veya destructive aksiyon iceren modallar disa tiklayinca kapanmaz.
- Bilgi amacli, tek aksiyonlu modallar disa tiklayinca kapanir.
- ConfirmModal destructive ise disa tiklayinca kapanmaz; destructive degilse kapanir.

## Disa Tiklayinca Kapanmayan Modallar
- Musteri > Siparis Olustur/Duzenle: Eksik Secimler
- Musteri > Siparis Olustur/Duzenle: Siparisi Onayla / Siparisi Guncelle
- Musteri > Siparisi Duzenle: Siparisi Iptal Et (onay adimi)
- Musteri > Siparisi Duzenle: Islemi Sonlandir
- Restoran > Menu > Yemek Sil
- Restoran > Menu > Yemek Ekle: Islemi Sonlandir
- Restoran > Ayarlar > Siparis Kapanis Saati: Degisiklikler kaydedilmedi
- Restoran > Menu > Porsiyon Guncelle
- Restoran > Siparis Detay: Siparis Durumu

## Disa Tiklayinca Kapanan Modallar
- Musteri > Siparis Olustur/Duzenle: Hata!
- Restoran > Siparis Detay: Guncelleme Basarisiz
- Musteri > Siparisi Duzenle: Siparisi Duzenle (kapatilabilir)

## Modal Buton Duzeni (Tum Modallar)
- Sol: iptal / geri don (guvenli, notr)
- Sag: birincil eylem (onayla, guncelle, cik, sil vb.)
- Eger eylem destructive ise sag buton kirmizi olur.

## Web Teknik Referanslari (Istege Bagli)
- GenericModal: src/common/components/modals/GenericModal/GenericModal.jsx
- ConfirmModal: src/common/components/modals/ConfirmModal/ConfirmModal.jsx
- DiscardChangesModal: src/common/components/modals/DiscardChangesModal/DiscardChangesModal.jsx
- OrderActionsModal: src/features/customer/components/OrderActionsModal/OrderActionsModal.jsx
- OrderScreen: src/features/customer/pages/Ordering/OrderScreen.jsx
- OrderDetailPage: src/features/restaurant/pages/OrderDetail/OrderDetailPage.jsx
- MenuPage: src/features/restaurant/pages/Menu/MenuPage.jsx
- MenuCreatePage: src/features/restaurant/pages/Menu/MenuCreatePage.jsx
- OrderCutoffSettingsPage: src/features/restaurant/pages/Settings/OrderCutoffSettingsPage.jsx
- UpdateMealModal: src/features/restaurant/components/UpdateMealModal/UpdateMealModal.jsx
