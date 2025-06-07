import OrderCard from "../../components/OrderCard/OrderCard";
import FilterBar from "@/components/common/FilterBar/FilterBar";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import "./OrdersPage.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// FilterBar için bölge kategorileri doğrudan tanımlandı
const regionCategories = [
  { id: "Tümsan SS", name: "Tümsan SS" },
  { id: "İsdök SS", name: "İsdök SS" },
  { id: "Çevre SS", name: "Çevre SS" },
  { id: "Eskoop SS", name: "Eskoop SS" },
  { id: "Seafköy SS", name: "Seafköy SS" },
  { id: "Göngören SS", name: "Göngören SS" },
  { id: "Bağcılar SS", name: "Bağcılar SS" },
];

const Orders = () => {
  const navigate = useNavigate();
  // Örnek sipariş verileri
  const [orders] = useState([
    {
      id: 1,
      company: "Innova",
      region: "Tümsan SS",
      orderTime: "14:30",
      status: "completed",
      totalPeople: 8,
      orderItems: [
        {
          mealName: "Musakka",
          quantity: 3,
          category: "Ana Yemek",
          image:
            "https://banafikirver.com/images/posts/2022/10/post-1664956001-703-patlican-musakka-scaled.webp",
        },
        {
          mealName: "İzmir Köfte",
          quantity: 3,
          category: "Ana Yemek",
          image:
            "https://static.daktilo.com/sites/71/uploads/2024/06/20/gercek-izmir-koftesi-bu-tarif-ile-25-dakikada-hazir.jpg",
        },
        {
          mealName: "Tavuk Sote",
          quantity: 2,
          category: "Ana Yemek",
          image:
            "https://i.kayserianadoluhaber.com.tr/c/90/1280x720/s/dosya/haber/lezzetli-tavuk-sote-tarifi-pra_1687159009_0mbWe6.jpg",
        },
        {
          mealName: "Mercimek Çorbası",
          quantity: 3,
          category: "Çorbalar",
          image:
            "https://cdn.karar.com/other/2022/04/15/mercimek-corbasi-kapak.jpg",
        },
        {
          mealName: "Yayla Çorbası",
          quantity: 3,
          category: "Çorbalar",
          image:
            "https://avatars.mds.yandex.net/i?id=04592a8bacaa9ae92172dba8d7ef8aa33d6d58e452af58e4-9214559-images-thumbs&n=13",
        },
        {
          mealName: "Domates Çorbası",
          quantity: 2,
          category: "Çorbalar",
          image:
            "https://img.piri.net/mnresize/720/-/resim/upload/2022/01/19/02/21/c95ab60cdomates.jpg",
        },
        {
          mealName: "Pirinç Pilavı",
          quantity: 4,
          category: "Pilavlar ve Makarnalar",
          image:
            "https://iaftm.tmgrup.com.tr/206a1b/0/0/0/0/0/0?u=https://iftm.tmgrup.com.tr/2023/11/03/pirinc-pilavi-tarifi-pirinc-pilavi-nasil-yapilir-malzemeleri-ve-puf-noktalari-1698997345555.jpg&mw=700",
        },
        {
          mealName: "Bulgur Pilavı",
          quantity: 4,
          category: "Pilavlar ve Makarnalar",
          image: "https://www.yurtgazetesi.com.tr/d/news/218253.jpg",
        },
        {
          mealName: "Sütlaç",
          quantity: 4,
          category: "Tatlılar ve Salatalar",
          image:
            "https://avatars.mds.yandex.net/i?id=c0edf18311c3032631f944c57312f8cc35bb8c5a-5235721-images-thumbs&n=13",
        },
        {
          mealName: "Kemalpaşa Tatlısı",
          quantity: 4,
          category: "Tatlılar ve Salatalar",
          image:
            "https://www.pratikyemektarifi.net/wp-content/uploads/2014/08/kemalpasa.jpg",
        },
      ],
    },
    {
      id: 2,
      company: "Teknosa",
      region: "İsdök SS",
      orderTime: "14:15",
      status: "pending",
      totalPeople: 12,
      orderItems: [
        {
          mealName: "Kuru Fasulye",
          quantity: 4,
          category: "Ana Yemek",
          image:
            "https://im.haberturk.com/l/2020/10/13/ver1602592501/2834154/jpg/1200x628",
        },
        {
          mealName: "Biber Dolması",
          quantity: 4,
          category: "Ana Yemek",
          image:
            "https://images.unsplash.com/photo-1673646960062-9aeb2188335f?q=80&w=3265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          mealName: "Rosto Köfte",
          quantity: 4,
          category: "Ana Yemek",
          image: "https://cdn.karar.com/other/2022/09/12/basliksiz-2.jpg",
        },
        {
          mealName: "Ezogelin Çorbası",
          quantity: 6,
          category: "Çorbalar",
          image:
            "https://img.cdn.haber365.com.tr/uploads/images/gallery/chVTQKW66xfNp4QnTzC91hZJTqml3k7d-body.jpg",
        },
        {
          mealName: "Tavuk Suyu Çorbası",
          quantity: 6,
          category: "Çorbalar",
          image:
            "https://sosyola.com/wp-content/uploads/2021/02/tavuk-suyuna-corba-tarifi.jpg",
        },
        {
          mealName: "Spagetti Makarna",
          quantity: 6,
          category: "Pilavlar ve Makarnalar",
          image: "https://i.ytimg.com/vi/XBy9RhG6uQU/maxresdefault.jpg",
        },
        {
          mealName: "Mantarlı Makarna",
          quantity: 6,
          category: "Pilavlar ve Makarnalar",
          image:
            "https://www.yemekev.com/uploads/images/gallery/yemekev-mantarli-makarna-2.JPG",
        },
        {
          mealName: "Puding",
          quantity: 6,
          category: "Tatlılar ve Salatalar",
          image:
            "https://i.pinimg.com/736x/66/df/6a/66df6ab6d91e1d3012612c8b9897fbde.jpg",
        },
        {
          mealName: "Kazandibi",
          quantity: 6,
          category: "Tatlılar ve Salatalar",
          image:
            "https://i.pinimg.com/originals/11/c2/4d/11c24d51a5059cd900aab83f34dc9497.jpg",
        },
      ],
    },
    {
      id: 3,
      company: "Migros",
      region: "Çevre SS",
      orderTime: "14:00",
      status: "completed",
      totalPeople: 14,
      orderItems: [
        {
          mealName: "Musakka",
          quantity: 5,
          category: "Ana Yemek",
          image:
            "https://banafikirver.com/images/posts/2022/10/post-1664956001-703-patlican-musakka-scaled.webp",
        },
        {
          mealName: "Tavuk Sote",
          quantity: 5,
          category: "Ana Yemek",
          image:
            "https://i.kayserianadoluhaber.com.tr/c/90/1280x720/s/dosya/haber/lezzetli-tavuk-sote-tarifi-pra_1687159009_0mbWe6.jpg",
        },
        {
          mealName: "İzmir Köfte",
          quantity: 4,
          category: "Ana Yemek",
          image:
            "https://static.daktilo.com/sites/71/uploads/2024/06/20/gercek-izmir-koftesi-bu-tarif-ile-25-dakikada-hazir.jpg",
        },
        {
          name: "Mercimek Çorbası",
          quantity: 7,
          category: "Çorbalar",
          image:
            "https://cdn.karar.com/other/2022/04/15/mercimek-corbasi-kapak.jpg",
        },
        {
          name: "İşkembe Çorbası",
          quantity: 7,
          category: "Çorbalar",
          image:
            "https://i11.haber7.net/haber/haber7/photos/2022/01/1KpKz_1641725157_446.jpg",
        },
        {
          name: "Şehriyeli Pilav",
          quantity: 7,
          category: "Pilavlar ve Makarnalar",
          image: "https://cdn.karar.com/news/1461752.jpg",
        },
        {
          name: "Kelebek Makarna",
          quantity: 7,
          category: "Pilavlar ve Makarnalar",
          image:
            "https://static.daktilo.com/sites/535/uploads/2023/12/18/67a9602-scaled-1702900758.jpg",
        },
        {
          name: "Sütlaç",
          quantity: 7,
          category: "Tatlılar ve Salatalar",
          image:
            "https://avatars.mds.yandex.net/i?id=c0edf18311c3032631f944c57312f8cc35bb8c5a-5235721-images-thumbs&n=13",
        },
        {
          name: "Yoğurt",
          quantity: 7,
          category: "Tatlılar ve Salatalar",
          image:
            "https://avatars.mds.yandex.net/i?id=a45e0f1bb967549415abded417ff2d7a-5348469-images-thumbs&n=13",
        },
      ],
    },
    {
      id: 4,
      company: "Ahmet Yılmaz",
      region: "Eskoop SS",
      orderTime: "13:45",
      status: "pending",
      totalPeople: 1,
      orderItems: [
        {
          mealName: "Kuru Fasulye",
          quantity: 1,
          category: "Ana Yemek",
          image:
            "https://im.haberturk.com/l/2020/10/13/ver1602592501/2834154/jpg/1200x628",
        },
        {
          mealName: "Mercimek Çorbası",
          quantity: 1,
          category: "Çorbalar",
          image:
            "https://cdn.karar.com/other/2022/04/15/mercimek-corbasi-kapak.jpg",
        },
        {
          mealName: "Pirinç Pilavı",
          quantity: 1,
          category: "Pilavlar ve Makarnalar",
          image:
            "https://iaftm.tmgrup.com.tr/206a1b/0/0/0/0/0/0?u=https://iftm.tmgrup.com.tr/2023/11/03/pirinc-pilavi-tarifi-pirinc-pilavi-nasil-yapilir-malzemeleri-ve-puf-noktalari-1698997345555.jpg&mw=700",
        },
        {
          mealName: "Ayran",
          quantity: 1,
          category: "Tatlılar ve Salatalar",
          image: "https://seckinpide.com.tr/userfiles/files/sutas-300-ml.jpeg",
        },
      ],
    },
    {
      id: 5,
      company: "Mono metal",
      region: "Eskoop SS",
      orderTime: "15:00",
      status: "pending",
      totalPeople: 4,
      orderItems: [],
    },
    {
      id: 6,
      company: "Lazer Makine",
      region: "Seafköy SS",
      orderTime: "15:05",
      status: "pending",
      totalPeople: 5,
      orderItems: [],
    },
    {
      id: 7,
      company: "Ak Oto Yıkama",
      region: "Göngören SS",
      orderTime: "15:10",
      status: "pending",
      totalPeople: 7,
      orderItems: [],
    },
    {
      id: 8,
      company: "Kenan Motor",
      region: "Bağcılar SS",
      orderTime: "15:15",
      status: "pending",
      totalPeople: 3,
      orderItems: [],
    },
    {
      id: 9,
      company: "Karmak Alüminyum",
      region: "Çevre SS",
      orderTime: "15:20",
      status: "pending",
      totalPeople: 4,
      orderItems: [],
    },
    {
      id: 10,
      company: "Onur Metal",
      region: "İsdök SS",
      orderTime: "15:25",
      status: "pending",
      totalPeople: 4,
      orderItems: [],
    },
    {
      id: 11,
      company: "Simge Elektronik",
      region: "Çevre SS",
      orderTime: "15:30",
      status: "pending",
      totalPeople: 10,
      orderItems: [],
    },
  ]);

  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Siparişleri filtreleme ve sıralama (şirket adına göre arama ve bölge filtresi)
  const filteredOrders = [...orders]
    .filter((order) =>
      order.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((order) => filterType === "all" || order.region === filterType)
    .sort((a, b) => {
      const [hA, mA] = a.orderTime.split(":").map(Number);
      const [hB, mB] = b.orderTime.split(":").map(Number);
      return hA * 60 + mA - (hB * 60 + mB);
    });

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "pending"
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "completed"
  );

  // Siparişleri site (region) bazında gruplandırma
  const groupOrdersByRegion = (ordersList) => {
    return ordersList.reduce((acc, order) => {
      if (!acc[order.region]) acc[order.region] = [];
      acc[order.region].push(order);
      return acc;
    }, {});
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className='orders-content'>
      <PageHeader title='Siparişler' />

      <FilterBar
        categories={regionCategories}
        selectedCategory={filterType}
        onCategoryChange={setFilterType}
      />

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder='Firma Ara...'
      />

      <div className='orders-layout'>
        {pendingOrders.length > 0 && (
          <div className='orders-section'>
            <h2 className='section-title'>Bekleyen Siparişler</h2>
            <div className='orders-grid'>
              {Object.entries(groupOrdersByRegion(pendingOrders)).map(
                ([region, orders]) => (
                  <div key={region} className='orders-by-region'>
                    <h3 className='region-title'>{region}</h3>
                    <div className='orders-region-grid'>
                      {orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={handleOrderClick}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {completedOrders.length > 0 && (
          <div className='orders-section completed-section'>
            <h2 className='section-title'>Tamamlanan Siparişler</h2>
            <div className='orders-grid'>
              {Object.entries(groupOrdersByRegion(completedOrders)).map(
                ([region, orders]) => (
                  <div key={region} className='orders-by-region'>
                    <h3 className='region-title'>{region}</h3>
                    <div className='orders-region-grid'>
                      {orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={handleOrderClick}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
