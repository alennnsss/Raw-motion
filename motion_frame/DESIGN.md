---
name: Raw Motion Frame
description: Сайт студии видеомонтажа. Visuals that move.
colors:
  primary-lime: "#C6FF00"
  ink: "#0A0A0A"
  paper: "#F2F0EA"
  card-paper: "#E7E5DE"
  surface: "#141413"
  raise: "#1D1D1B"
  ghost-gray: "#504F4D"
  muted-on-dark: "#B4B3AB"
  muted-on-light: "#56554F"
typography:
  display:
    fontFamily: "Unbounded, Inter, system-ui, sans-serif"
    fontSize: "clamp(38px, 5.4vw, 76px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Unbounded, Inter, system-ui, sans-serif"
    fontSize: "clamp(34px, 6.4vw, 72px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
rounded:
  sm: "10px"
  md: "16px"
  lg: "40px"
spacing:
  gutter-mobile: "16px"
  gutter: "32px"
  section-mobile: "80px"
  section: "140px"
components:
  button-primary:
    backgroundColor: "{colors.primary-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
    height: "52px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
    height: "52px"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
    height: "44px"
  price-card:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "32px"
  price-card-featured:
    backgroundColor: "{colors.primary-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "32px"
---

# Design System: Raw Motion Frame

## Overview

**Creative North Star: "Visuals that move"** (слоган брендбука).

Монтажная студия, которая показывает работу, а не рассказывает о ней. Крупные блоки чёрного и бумажного цвета чередуются и наезжают друг на друга скруглёнными краями, как клипы на таймлайне. Широкий гротеск в заголовках даёт напор, спокойный Inter держит текст. Лайм появляется дозированно: это плейхед, а не заливка.

Анти-образец: шаблонные «агентские» лендинги с подписями-кикерами над каждым заголовком, моно-метками, HUD-декором, капсом 900 и неоновым свечением.

**Key Characteristics:**
- Тёмные и светлые блоки во всю ширину со скруглением 40 px.
- Заголовки Unbounded 700 в обычном регистре.
- Работа (шоурил, ролики) занимает место, которое у шаблона заняли бы иконки и цифры.

## Colors

### Primary
- **Лайм-плейхед** (primary-lime): кнопка главного действия, плашка под одним словом в Hero, выделенный тариф, фокус на тёмном. На лайме только чёрный текст.

### Neutral
- **Чернила** (ink) и **бумага** (paper): фон тёмных и светлых блоков и текст друг на друге.
- **Бумага карточек** (card-paper): карточки цен на светлом фоне.
- **Поверхность** (surface) и **подъём** (raise): фон под видео и тёмные кнопки внутри тёмных блоков.
- **Призрачная полоса** (ghost-gray): декор и границы, никогда не текст.
- **Приглушённый текст**: muted-on-dark на тёмном, muted-on-light на светлом.

### Named Rules
**The One Lime Rule.** Одно лаймовое место на экран (кнопка действия может быть вторым). Лайм никогда не светится.

**The Ghost Is Not Text Rule.** Серые #222220, #504F4D, #757570 только для линий и декора.

## Typography

**Display Font:** Unbounded 700 (с запасным Inter).
**Body Font:** Inter 400–600.

### Hierarchy
- **Display** (700, clamp 38–76 px): только h1 в Hero.
- **Headline** (700, clamp 34–72 px): заголовки секций и формы.
- **Title** (Inter 600, 17–24 px): заголовки карточек, вопросов, вкладок.
- **Body** (Inter 400, 16–20 px): лиды и описания, ширина до 34em.
- **Label** (Inter 600, 15 px): кнопки, обычный регистр.

Цифры в цене и в строке фактов Hero набираются Unbounded, без переноса (`от 45 000 ₸` не разрывается).

### Named Rules
**The Sentence Case Rule.** Никакого капса и разрядки вне логотипа: ни в заголовках, ни в кнопках, ни в подписях.

**The No Kicker Rule.** Над заголовком секции нет мелкой подписи, номера или метки. Заголовок говорит сам.

## Layout

Мобильная версия первая (375 px), поля 16 px, на ≥768 px 32 px. Контейнер 1280 px. Секции 80 px по вертикали на телефоне и 140 px на десктопе. Hero на ≥1024 px: заголовок слева (1.25fr), шоурил 4:5 справа (0.75fr), ширина шоурила считается от высоты экрана. Портфолио — горизонтальная лента со scroll-snap во всю ширину экрана, первая карточка на линии контейнера.

## Elevation & Depth

Плоская система: глубину дают чередование тонов и наезд тёмных блоков на светлый фон (scale 0.94 → 1 при скролле), не тени.

## Shapes

Блоки 28 px на телефоне и 40 px на десктопе, карточки 16 px, кнопки и поля 10 px, круглые кнопки-иконки 44 px. Фирменная форма — уголки видоискателя (3 px, 36 px) только вокруг шоурила и лаймовые уголки при наведении на ролик.

## Components

### Buttons
Высота 52 px, Inter 600 15 px, стрелка уезжает вправо на 4 px при наведении, нажатие scale 0.97. Варианты: лаймовая (главное действие), тёмная, светлая, контурная (второе действие в Hero).

### Cards / Containers
Карточка цены: card-paper, 16 px, цена Unbounded. Выделенный пакет — лаймовая карточка с чёрной кнопкой. Карточка ролика без подложки: видео 9:16 со скруглением 16 px, подпись под ним (название, категория приглушённо).

### Inputs / Fields
PrimeVue InputText/Textarea/Checkbox, перекрашенные в `src/theme/primevue.ts`: радиус 10 px, граница ghost-gray, фокус лаймом.

### Navigation
Шапка на сплошном чёрном фоне (под PNG-логотип), прячется при скролле вниз, ссылки Inter 500 15 px, кнопка «Заявка» светлая.

### Showreel frame
Вертикальный шоурил 4:5 в уголках видоискателя, над ним серая и лаймовая полосы символа, кнопки звука и паузы внутри уголков.

## Do's and Don'ts

### Do:
- **Do** показывать ролики вместо иконок и цифр.
- **Do** держать одну строку фактов («100+ смонтированных роликов») вместо ряда больших цифр.
- **Do** проверять, что цена в тенге не переносится и страница не шире экрана на 375 px.

### Don't:
- **Don't** ставить подписи-кикеры, моно-метки, номера 01/02 и HUD-декор над заголовками.
- **Don't** использовать вес 800–900, капс в заголовках и кнопках, свечения и неон.
- **Don't** заводить квадраты с иконками и одинаковые карточки «иконка + заголовок + текст» как структуру страницы.
- **Don't** смешивать больше двух шрифтов и использовать эмодзи вместо иконок.
