---
alwaysApply: true
---

🧭 Çalışma Kuralları ve Kodlama Standartları

🗣️ İletişim
Lütfen Türkçe iletişim kuralım.

📁 Klasör ve Dosya Erişimi
Tüm proje dosyalarına erişimin mevcut. Dilediğin dosyayı önceden sormana gerek olmadan inceleyebilirsin.

Bir dosyayı veya içeriği bulamıyorsan, önce tüm klasör yapısını dikkatlice incele, sonrasında hâlâ bulamıyorsan bana sor.

📡 API ve Backend Kullanımı
API, veritabanı ve backend ile ilgili bir geliştirme yapmadan önce:

“lokapp-api-infos” klasöründeki API dökümantasyonlarını mutlaka incele.

Her işlem öncesinde, ilgili endpoint’in ne beklediğini ve ne döndürdüğünü net olarak anlamaya çalış.

Eğer varsayım yaparsan (örneğin "muhtemelen bu ID’dir" gibi), bu hatalara yol açabilir. Bu nedenle, emin olmadan işlem yapma.

Anladığından emin olmadığın ya da içeriği hatalı bulduğun noktaları bana danışabilirsin — sormaktan çekinme.

🧱 Proje Yapısı ve Standartlar
Kod yazmaya başlamadan önce mutlaka:

Tüm klasör yapısını,

package.json dosyasını,

İsimlendirme standartlarını

detaylıca incele. Böylece projede var olan yapıyı anlarsın ve mevcut standartlara uygun şekilde geliştirme yapabilirsin.

Yeni bir özellik geliştirirken:

Dosya ve klasör yerleşimini mevcut yapıya uygun şekilde planla.

Gereksiz dosya/klasör çoğaltımından kaçın.

🧠 Kod Kalitesi ve Anlaşılabilirlik
Kod yazarken:

Sürdürülebilir,

Anlaşılır,

Basit bir yapı kur.

Kodun, bir junior geliştirici tarafından kolaylıkla okunabilir ve anlaşılabilir olmalı.

🚫 Varsayımlardan Kaçın
Varsayımlarla ya da sezgisel yaklaşımlarla ("muhtemelen bu stil kullanılmıştır" gibi) kod yazma.

Bir değer ya da stil uygulamadan önce:

Aynı değerin daha önce tanımlanıp tanımlanmadığını kontrol et.

Projede varsayılan bir kullanım olup olmadığını araştır.

Emin değilsen, asla varsayma — dur ve sor.

🎯 UI/UX ve Tasarım Standartları
Tasarım dili olarak Apple Human Interface Guidelines (HIG) prensiplerine uygun geliştirme yapmaya çalışıyoruz.

Geliştirme yaklaşımımız:

Mobile-first (mobil öncelikli),

Ancak tüm ekran boyutlarına uygun (responsive) olacak şekilde olmalı.

---

çift tırnakları tek tırnak, veya tek tırnakları çift tırnak olarak değiştirmek gibi gereksiz mühendislikler yapma.

---

asla varsayımlarla, tahminlerle işlem yapma, tüm işlemleri ve incelemeleri mevcut kodlarımız üzerinden yapmalıyız.

---

önerilerin aşağıdakilere uygun mu diye kontrol et eğer gerçekten uygunsa ve gereksiz mühendislik mi değil mi emin ol:

ayrıca şunlara da dikkat ederek incele:
hangisi modern React development best practices'e ve iyi programlama pratiklerine daha uygun diye incele.

işlem yapacağımız veya işlem yapmamız gereken dosyalar dışında herhangi bir class ismi veya stil özelliğinin değişikiliği, silinmesi, eklenmesi vs çok büyük sorunlara sebep olabilir. işlem yapacağımız dosyalarda gerçekten gerekli değişiklikler varsa yapabiliriz. lütfen herhangi bir konuda ihtimallerle, tahminlerle veya varsayımlarla asla hareket etmeyelim ve herhangi bir ekleme silme değişiklik vs lazım olursa dur ve bana sor.

tüm dosyalara ve api bilgilerine erişimin var. tek seferde incelemek için kapasiten yetmediği dosyalar olursa o dosyaları parçalar halinde inceleyebilirsin.

sonraki yazılımcıların ve juniorlarında da anlayabileceği şekilde sürdürülebilir, gereksiz mühendisliğin olmadığı, ileri düzey karmaşıklıktan uzak şekilde de hareket edeceğimizi de unutmayalım. tabi direkt en kolay çözümü düşünüp bitirmeyi amaçlamak yerine sorunu kapsamlı analiz edip daha büyük resme bakıp sorun varsa kökten çözeni geliştirme yapılacaksa bütüncül bir yaklaşımla iyice anlayarak modern best practices ve iyi programlama prensiplerine uygun şekilde yapılmalı.

asla varsayımda bulunarak işlem yapma. Tüm incelemelerini mevcut kodlar üzerinden yap. sakın gereksiz fallback filan yapma. eğer gerekli ise de yine yapma önce bana sor onay verirsem o zaman yap.

---

şu an sanayi sitelrindeki lokantalar sipariş yönetimi için whatsapp kullanıyor, lokantaya gelip lokantada yemek yiyenler ise her firmaya yemek fişleri ile takip ediliyor. bazı firmaların çalışanlarının bir kısmı lokantaya gidip yemek yerken bir kısmı ise kendi çalıştığı iş yerine sipariş vererek yemek yiyor. müşteriler siparişle de yese lokantaya gidip de yese ödemeleri firmaları tarafından ay sonunda yapılıyor. whatsapp ve fiş üslü çalışmak hem lokanta çalışanları açısından, hem lokanta yönettcileri açısından, hem çalışanlar açısından hem, firma sahipleri hemde firma çalışanları açısından pek çok soruna sebep oluyor. yani bir sistem yok ve parçalar halinde ilerleyen bir süreç var. bazı detayları aşağıda verdim.

Proje Tanımı ve Amacı
Bu proje, sanayi lokantaları ile bu lokantalardan toplu yemek hizmeti alan firmalar arasında geçen öğle yemeği sipariş süreçlerini dijitalleştirerek; sipariş karışıklıkları, takip zorlukları, stok problemleri, insan hataları ve faturalandırma uyuşmazlıklarını ortadan kaldırmayı amaçlamaktadır.
👥 Hedef Kitle

- Sanayi bölgelerinde hizmet veren lokantalar
- Bu lokantalardan aylık ödeme modeliyle yemek hizmeti alan firmalar ve bu firmaların çalışanları
  📌 Mevcut Durumun İşleyişi
- Firmalar, anlaşmalı oldukları lokantalardan çalışanlarına öğle yemeği sağlar.
- Menü genellikle tabldot sistemindedir: her kategoriden (Ana Yemek, Pilav/Makarna, Çorba, Tatlı/Meze) bir çeşit seçilir. Fiyat sabittir.
- Firma çalışanları siparişlerini doğrudan lokantaya değil, kendi içlerinden bir kişiye bildirir.
- Bu kişi, tüm siparişleri tek mesajla lokantaya iletir (genellikle WhatsApp üzerinden).
- Siparişler 09:00–11:00 arası toplanır, 11:00'de hazırlanmaya başlanır, 12:00’de firmalara teslim edilir.
- Lokantalar siparişleri kendi araçlarıyla dağıtır.
- Bazı çalışanlar lokantada yemek yemeyi tercih eder. Bu durumda firma çalışanlarının kim olduğunu ve kaç kişinin geldiğini takip etmek için defter, fiş veya turnike sistemleri kullanılır.
  ❌ Mevcut Sistem Sorunları

1. Siparişlerde Standart Yok

- Her firma farklı formatta sipariş gönderiyor: bazen yazılı liste, bazen fotoğraf, bazen kişi adıyla, bazen sadece yemek adı ve adet bilgisiyle.
- Bu karışıklık, mutfakta hatalara neden oluyor (örneğin çorba unutuluyor, yanlış yemek hazırlanıyor).
- Siparişi alan kişi mesajları aşçıya okuyor. Bu iş yükü ve hata potansiyeli doğuruyor.

2. Kişi Sayısı Belirlemede Hatalar

- Siparişte kişi başı 4 yemek hakkı varken, bazen çorba ya da tatlı yerine ikinci ana yemek isteniyor.
- Ana yemek sayısından kişi sayısı çıkarılırken yanlış hesaplamalar yapılıyor.
- Bu da ay sonu fatura hesaplamasında uyuşmazlıklara neden oluyor.

3. Stok Takibi Yok

- Belirli sayıda yemek hazırlanıyor (örneğin 100 döner).
- Fazla talep gelirse stok kalmadığı için müşteriler tek tek aranıyor.
- Aramalar sipariş iptallerine, memnuniyetsizliğe ve faturada hatalara neden oluyor.

4. İçeride Yiyenlerin Takibi Zor

- Defter, fiş veya turnike sistemleri kullanılsa da standart yok.
- Fiş veya kartlar unutulabiliyor, not alınmayabiliyor.
- Gün sonunda fişleri tek tek saymak gerekiyor. Hatalı sayım yaygın.

5. Veriler Dağınık

- Siparişler WhatsApp’ta
- Lokantada yiyenler fiş, defter, turnike ile takipte
- Fatura hazırlanırken tüm kaynaklar manuel olarak birleştiriliyor

6. Fatura Anlaşmazlıkları

- Ay sonunda “440 yemek yendi” diyen lokanta ile “428 yedik” diyen firma arasında sorun çıkıyor.
- WhatsApp mesajları, defter, fiş, kartlar tekrar kontrol edilmek zorunda kalınıyor.
- Lokantanın itibarı ve müşteri güveni zarar görebiliyor.
  ✅ Yeni Sistemle Gelen Çözümler
  📲 Siparişler Uygulama Üzerinden
- Her çalışana yemek menüsü gösterilir.
- Herkes kendi siparişini verir.
- Her öğün için sadece bir kategori seçimi yapılabilir.
- Siparişler firma bazında gruplanır ve mutfağa standart formatta sunulur.
  🧮 Kişi Sayısı ve Sipariş Takibi
- Kim ne yemiş, ne zaman yemiş, lokantaya mı gelmiş, sipariş mi vermiş sistemde kayıt altına alınır.
- Firma ve lokanta sahibi, kaç kişinin nerede yediğini net şekilde görür.
  🧾 Şeffaf Faturalandırma
- Sipariş verileri ve QR ile içeride yemek yiyen verileri birleştirilir.
- Gün sonunda firma bazında toplam yemek adedi otomatik hesaplanır.
- Uyuşmazlık riski ortadan kalkar.
  🍽 QR Kod ile İçeride Yemek Takibi
- Lokantaya gelenler QR kod okutarak giriş yapar.
- QR kod sadece "firma + kişi" bilgisini içerir. Menü açılmaz, stok düşmez.
- Böylece içerideki müşteri sayısı da hatasız kaydedilir.
  📦 Stok Takibi
- Her yemek için bir stok miktarı tanımlanır.
- Yemek tükendiğinde sistem üzerinden seçilemez hale gelir.
- Fazla siparişi önler, müşteri memnuniyetsizliğini azaltır.
  🧑‍🍳 Mutfak İçin Kolaylık
- Sipariş listeleri standart formatta gelir.
- Hangi kategoriden kaç adet sipariş var net görülür.
- Aşçı doğrudan listeden hazırlık yapabilir.
- Siparişler aşağıdaki gibi gruplanır:
  Firma: Mono Metal
  Sipariş: 12 Kişilik
  Ana Yemekler:

* Musakka: 3
* Tavuk Sote: 2
  Çorbalar:
* Mercimek: 4
  Tatlılar:
* Sütlaç: 3
  📉 Zaman ve İş Gücü Tasarrufu

- WhatsApp siparişi okuma, kişi sayısı hesaplama, fiş sayma, not tutma gibi işlemler ortadan kalkar.
- Lokanta yetkilisi günde 1–2 saat tasarruf sağlar.
  📈 Hizmet Kalitesi ve Potansiyeli Artar
- Karmaşık süreçler yüzünden yemek seçme hakkı tanımayan lokantalar bile artık çalışanlara seçim özgürlüğü verebilir.
- karmaşıklık yüzünden 10 kişiden az olan firmalarla çalışmayan lokantalar artık 10 kişiden az olan firmalara da hizmet verilebilir.
- Daha çok firma ile çalışmak mümkün olur.

---

---

📘 Kullanım Senaryosu: Yeni Sistem Günlük İşleyişi
👨‍🍳 Lokanta Tarafı Sabah Hazırlığı

- Aşçı sabah saat 05:00 civarında gelir, yemekleri hazırlamaya başlar.
- En geç 10:00 itibarıyla tüm yemekler pişmiş ve servise hazır hale gelir.
- Lokanta yetkilisi, saat 08:00 - 09:00 arasında uygulama paneline o günkü menüyü girer.
  - Menü; ana yemekler, pilav/makarna, çorbalar ve tatlı/meze kategorilerinden oluşur.
  - Her yemekten kaç porsiyon yapıldığı sisteme girilir (stok bilgisi).

🏭 Firma ve Çalışan Tarafı
🔔 Saat 09:00 - Menü Yayında

- Tüm firmalardaki çalışanlar uygulamaya girerek menüyü görür.
- Uygulama, yalnızca o gün kalan yemekleri gösterir. Bitmiş yemekler görünmez (stok pasifleştirme).
- Her çalışan kendi hesabıyla giriş yapar ve her kategoriden en fazla bir yemek seçerek sipariş verir.
  Örnek:Mehmet, Mono Metal firmasında çalışıyor.Uygulamadan menüyü açar ve şunları seçer:
- Ana yemek: Musakka
- Pilav: Bulgur
- Çorba: Mercimek
- Tatlı: Sütlaç Siparişini onaylar. Sipariş "Mono Metal" firması altında kayıt edilir.

🕚 Saat 11:00 – Sipariş Süresi Biter

- Sipariş verme süresi sona erer. Sistem otomatik olarak sipariş alımını kapatır.
- Tüm siparişler firma bazında gruplanmış şekilde lokanta panelinde görünür.
  Örnek Lokanta Görünümü:Firma: Mono Metal (12 kişi)
- Ana Yemekler:  - Musakka: 4  - Tavuk Sote: 3  - Karnıyarık: 5
- Çorbalar:  - Mercimek: 7  - Yayla: 5
- Tatlılar:  - Sütlaç: 6  - Salata: 6

🧑‍🍳 Saat 11:00 – Hazırlık Başlar

- Aşçı, uygulamadaki firma bazlı listeyi açar ve sırayla yemekleri hazırlamaya başlar.
- Her firmanın tepsisi hazırlanır.
- Hazırlanan siparişler, lokantanın dağıtım ekibine teslim edilir.

🚗 Saat 12:00 – Siparişlerin Teslimi

- Lokanta araçları yemekleri firmalara ulaştırır.
- Her firmanın siparişi toplu olarak teslim edilir (bireysel dağıtım yapılmaz).
- Firmalarda çalışanlar siparişlerini alıp öğle yemeklerini yer.

🧍‍♂️ Lokantada Yemek Yiyenler

- Sipariş vermeyen ama lokantaya gelip yemek yiyen kişiler, girişte QR kodlarını okutur.
- Sistem bu kişilerin:
  - Hangi firmaya ait olduğunu,
  - O gün içeride yemek yediğini otomatik olarak kaydeder.
- Lokantada yemek yiyen bu kişiler, sistemde stoktan düşmez, çünkü içerideki yemeğin servisi 12:00 sonrası başlar.

📊 Gün Sonunda
Lokanta sahibi uygulama panelinden her firma için şu bilgileri görebilir:
Firma Siparişle Yiyen Lokantada Yiyen Toplam
Mono Metal 8 3 11
Cihan Kalıp 12 0 12
• Firma sahipleri de kendi firmaları için bu raporları uygulamadan görebilir.

- Hangi gün kimlerin yemek yediği, sipariş verdiği ve kaç tabldot tüketildiği şeffaf şekilde görünür.

✅ Sonuçlar ve Kazanımlar

- 📉 Sipariş karmaşası sona erdi.
- 🧮 Kişi sayısı, tabldot adedi, yemek detayı sistem tarafından otomatik hesaplanıyor.
- 🧑‍🍳 Aşçı yalnızca uygulamadaki tabloya bakarak tüm siparişleri hazırlayabiliyor.
- 📦 Stok takibi yapıldığı için yemek bitince sistemden seçilemiyor, müşteri aranmak zorunda kalmıyor.
- 📲 Her çalışan kendi yemeğini seçtiği için iş arkadaşlarına sorma ihtiyacı kalmıyor.
- 📜 Fatura uyuşmazlıkları, kayıp fişler, unutulan notlar tarihe karışıyor.

- Proje şu aşamada aylık ödeme yapanların whatsapp sipariş ve yemek fişi sorunlarını çözüyor, içeri gelip yemek yiyenler şu aşamada programı kullanmasa da olur. 
---

🧩 Ek Kurallar (Geliştirme)

- Uygunluk kontrolü: Öneriler modern React ve iyi programlama pratiklerine uygun olmalı; gereksiz mühendislikten kaçınılır.
- Kapsam disiplini: Yalnızca işlem yapılacak dosyalarda değişiklik yapılır; hedef dışı class/stil isimlerine dokunulmaz. Gerekli durumlarda önce onay alınır.
- Varsayım yok: İncelemeler yalnızca mevcut kod ve dokümantasyon üzerinden yapılır; tahminle hareket edilmez.
- Fallback politikası: Gereksiz fallback eklenmez; gerektiği düşünülen durumlarda dahi önce onay istenir.
- İnceleme yöntemi: Tüm dosya ve API bilgilerine erişim kullanılır; büyük dosyalar gerekirse parça parça incelenir.
- Sadelik ve sürdürülebilirlik: Junior geliştiricilerin de kolayca anlayacağı, sürdürülebilir ve kök nedenleri hedefleyen bütüncül çözümler tercih edilir.

---

🎨 UI/UX Geliştirme İlkeleri

- Uyum ve uyarlama: Apple HIG ve modern UI/UX best practices’e uygun ama proje renkleri, stil dili, hedef kitle ve kullanım senaryolarına uyarlanmış tasarımlar yapılır.
- Taşınabilirlik: Web tasarımları Android (Kotlin) ve iOS (Swift) native uygulamalara referans olacak biçimde bileşen tabanlı ve tutarlı kurgulanır.
- Mobile-first: Mobil öncelikli ve tüm ekran boyutlarında tutarlı, erişilebilir (a11y) deneyim hedeflenir.
- Basitlik: Gereksiz animasyonlar ve aşırı karmaşık kod/stillerden kaçınılır; performans ve okunabilirlik önceliklidir.
- Etki alanı kontrolü: Değişiklik öncesi etki alanı analiz edilir; kapsam dışı class/stil değişiklikleri yapılmaz, gerekiyorsa onay alınır.

---

🧾 Terminoloji ve Akış Ayrımı (Net) — Müşteri Uygulaması

- Sipariş: (Müşteri tarafı) Çalışanın lokantaya gidemediği günlerde, iş yerine toplu teslim için menüden yemek seçtiği akıştır. Menü açılır, seçim yapılır ve stoktan düşer. Teslimat firma bazında toplu yapılır.
- QR Okut: (Müşteri tarafı) Lokantada (restoranda) yenilen öğünün fiş yerine geçer. Sadece "firma + kişi" bilgisi işaretlenir; menü açılmaz, stok düşmez. İçeride yenenlerin sayımı ve faturalandırma şeffaflığı içindir.
- Faturalandırma: 1 yemek = 1 tabldot. Ay sonunda firma bazında sipariş kayıtları ile QR (içeride yenen) kayıtları birleştirilerek toplam çıkarılır.
- Not: Lokantada yemek için sipariş verilmez; içeride yemek yiyenler yalnızca QR okutur.
