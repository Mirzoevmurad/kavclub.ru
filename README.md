# 🗺️ KavClub — Социальная сеть для путешественников (kavclub.ru)

Это веб-приложение представляет собой социальную сеть для путешественников, разработанную в фирменном дизайне по правилам **Apple Human Interface Guidelines (стиль iOS)** с поддержкой светлой и тёмной темы, эффектами матового стекла, iOS Tab Bar навигацией и нативными микро-анимациями.

---

## 🚀 Как запустить проект локально

### Требования:
*   Установленная Node.js (версия 18 и выше)
*   Браузер с поддержкой веб-технологий

### Инструкция:
1. Зайдите в папку проекта:
   ```bash
   cd kavclub
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите сервер разработки:
   ```bash
   npm run dev
   ```
4. Откройте в браузере: `http://localhost:3000`

---

## 🐳 Запуск через Docker (для сервера или VPS)

Для развертывания на вашем сервере под доменом `kavclub.ru` проект подготовлен к контейнеризации. Он автоматически поднимает веб-приложение Next.js и базу данных **PostgreSQL с расширением PostGIS** (для гео-запросов и хранения координат).

### Инструкция:
1. Установите Docker и Docker Compose на ваш сервер.
2. Запустите сборку и запуск контейнеров в фоновом режиме:
   ```bash
   docker-compose up --build -d
   ```
3. Веб-приложение станет доступно на порту `3000`, а СУБД PostgreSQL на стандартном порту `5432`.

---

## 🌐 Настройка домена `kavclub.ru` (Nginx + SSL)

Чтобы сайт открывался по адресу `https://kavclub.ru`, настройте Nginx на вашем сервере как Reverse Proxy:

### 1. Конфигурация Nginx:
Создайте файл `/etc/nginx/sites-available/kavclub` со следующим содержимым:

```nginx
server {
    listen 80;
    server_name kavclub.ru www.kavclub.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Включение конфигурации и получение SSL:
```bash
sudo ln -s /etc/nginx/sites-available/kavclub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Получение бесплатного SSL-сертификата Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d kavclub.ru -d www.kavclub.ru
```

---

## 📂 Структура проекта
*   `src/app/globals.css` — Дизайн-система iOS (Vanilla CSS). Мягкие тени, скругления, переменные цветов темной/светлой темы.
*   `src/app/page.tsx` — Главный экран: интерактивная лента, Foodie-карточки, клонирование чужих маршрутов (Фишка №7).
*   `src/app/wishlist/page.tsx` — Интерактивная карта «Был / Хочу посетить» с детальной статистикой.
*   `src/app/meetups/page.tsx` — Доска объявлений «Попутчики на 24 часа» (Фишка №10) с формой публикации.
*   `src/app/guides/page.tsx` — Каталог верифицированных гидов с рейтингами, языками и авторскими турами.
*   `src/app/profile/page.tsx` — Страница профиля путешественника с системой наград и бейджей (Фишка №6).
*   `src/components/NavBar.tsx` & `TabBar.tsx` — Навигационные элементы в стиле iOS.
