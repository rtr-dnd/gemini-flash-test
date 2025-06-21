## ENIAQ Next Template

現場で使いやすい最小限のカスタマイズが施されたNext.jsのテンプレートリポジトリです。

`create-next-app`では以下の設定を使っています。

- Typescript
- app directory
- Tailwind CSS

上記で生成されたコードに、以下の設定をしています。

- ESlint/Prettierの設定：[GTS](https://github.com/google/gts), [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import/tree/main)
- SVGインポートの設定：[SVGR](https://react-svgr.com/docs/next/)

今後以下の内容も含めたいと考えています。

- スタイリングされたUIコンポーネントライブラリ（Mui, Radix, Headless UIのいずれか）

## 使用手順

- 文字列`next-template`を希望のプロジェクト名に置換
- `git remote set-url origin (新しいリポジトリのURL)`を実行
- `git remote add template https://github.com/eniaq/next-template`を実行
- `rename-me.code-workspace`を希望のプロジェクト名に変更し、Workspaceを開く

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
