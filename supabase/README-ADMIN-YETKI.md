# Admin ve Panel Yetkileri

Bu özellik yönetim paneline birden fazla admin eklemek ve her admin için panel erişimi belirlemek için hazırlanmıştır.

## 1. Veritabanı

Supabase Dashboard > SQL Editor bölümünde:

1. `supabase/admin-users.sql` dosyasının tamamını çalıştırın.
2. İlk mevcut yönetici hesabıyla tekrar yönetim paneline girin.
3. İlk başarılı çağrıda mevcut hesap otomatik olarak Süper Admin olarak kaydedilir.

## 2. Edge Function

Supabase Dashboard > Edge Functions bölümünden `admin-users` isimli bir function oluşturun ve:

`supabase/functions/admin-users/index.ts`

dosyasındaki kodu function kodu olarak yayınlayın.

Supabase Edge Function'ın kullanıcı JWT'siyle çağrılması gerekir. Function içinde service/secret key kullanılır; bu anahtar kesinlikle tarayıcıdaki JavaScript'e veya GitHub Pages'a konulmamalıdır.

## 3. İlk kullanım

İlk mevcut admin giriş yaptığında:

- Genel Bakış
- Portföy
- Site Ayarları
- Tasarım
- İletişim
- Online Ürünler
- Admin Yönetimi

panellerinin tamamına erişebilir.

Ardından **Admin Yönetimi** sekmesinden yeni admin oluşturabilirsiniz.

## 4. Admin yetkileri

Normal admin için istediğiniz panelleri işaretleyin:

- Genel Bakış
- Portföy
- Site Ayarları
- Tasarım
- İletişim
- Online Ürünler
- Admin Yönetimi

Süper Admin seçilirse tüm paneller otomatik açılır.

## 5. Güvenlik

Şifreler düz metin olarak veritabanında tutulmaz; yeni kullanıcı Supabase Auth üzerinden oluşturulur. Supabase'in admin.createUser API'si yalnızca güvenilir sunucu tarafında kullanılmalıdır.

Bu sistem panel erişimini Edge Function üzerinden doğrular. Mevcut `portfolios` ve `site_settings` tablolarının yazma RLS politikaları bu repo üzerinden değiştirilmedi; çünkü mevcut projenin canlı politikalarını bilmeden bunları topluca değiştirmek mevcut siteyi bozabilir.

Kurulumdan sonra istenirse ikinci aşamada her panelin veritabanı yazma yetkileri de aynı izin sistemiyle RLS üzerinden ayrı ayrı sıkılaştırılabilir.